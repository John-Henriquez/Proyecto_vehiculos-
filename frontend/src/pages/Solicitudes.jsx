import { useState, useEffect } from 'react';
import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { getAllSolicitudes } from '../services/solicitudes.service.js';
import { getAllVehiculos } from '../services/vehiculos.service.js';
import { createRegistro } from '../services/registro.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import AcceptPopup from '../components/AcceptPopUp.jsx';
import RejectPopup from '../components/RejectPopUp.jsx';

const formatDateForFrontend = (date) => {
    if (!date || !date.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
      return date;
    }
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

const Solicitudes = () => {
    const { conductores } = useGetConductores();
    const [solicitudes, setSolicitudes] = useState([]);
    const [filterId, setFilterId] = useState('');
    const [vehiculos, setVehiculos] = useState([]);
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const fetchedSolicitudes = await getAllSolicitudes();
            if (Array.isArray(fetchedSolicitudes)) {
                const solicitudesNormalizadas = fetchedSolicitudes.map(solicitud => {
                    return {
                        ...solicitud,
                        placa_vehiculo: solicitud.placaPatente || solicitud.placa_patente || 'SIN PLACA', 
                        rut_conductor: solicitud.rut_conductor || null, 
                        fecha_solicitud: formatDateForFrontend(solicitud.fecha_solicitud),
                        fecha_salida: formatDateForFrontend(solicitud.fecha_salida),
                        fecha_regreso: formatDateForFrontend(solicitud.fecha_regreso),
                    };
                });

                setSolicitudes(solicitudesNormalizadas);
            } else {
                console.error('La respuesta de solicitudes no es un arreglo:', fetchedSolicitudes);
            }
        };

        const fetchVehiculos = async () => {
            const fetchedVehiculos = await getAllVehiculos();
            setVehiculos(fetchedVehiculos);
        };

        fetchSolicitudes();
        fetchVehiculos();
    }, []);

    const handleAccept = (solicitud) => {
        console.log("handleAccept:", solicitud);
        setCurrentSolicitud(solicitud); 
        setShowAcceptPopup(true); 
    };

    const handleReject = (id_solicitud) => {
        if (typeof id_solicitud !== 'number') {
            console.error("Error: La solicitud pasada a handleReject no es un ID válido", id_solicitud);
            return;
        }
        setCurrentSolicitud({ id_solicitud }); 
        setShowRejectPopup(true); 
    };
    

    const handleConfirmAccept = async (updatedSolicitud) => {
        console.log("Confirmando aceptación para la solicitud ID:", currentSolicitud.id_solicitud);
    
        // 1. Crear un registro con la información de la solicitud aceptada
        const registroData = {
            id_solicitud: currentSolicitud.id_solicitud,
            placa_vehiculo: currentSolicitud.placa_vehiculo,
            fecha_solicitud: currentSolicitud.fecha_solicitud,
            estado: 'aceptada',
            observaciones: updatedSolicitud.observaciones,
            prioridad: currentSolicitud.prioridad,
            fecha_cambio_estado: new Date(), // Fecha actual
        };
    
        const [registro, error] = await createRegistro(registroData); // Llamada a la función de servicio para crear el registro
        if (error) {
            console.error("Error al crear el registro:", error);
            return;
        }
    
        // 2. Eliminar la solicitud después de crear el registro
        await deleteSolicitud(currentSolicitud.id_solicitud);
    
        // 3. Actualizar el estado de la solicitud en el frontend
        setSolicitudes((prev) =>
            prev.filter((sol) => sol.id_solicitud !== currentSolicitud.id_solicitud)
        );
        setShowAcceptPopup(false);
    };
    

    const handleConfirmReject = async (updatedSolicitud) => {
        console.log("Confirmando rechazo para la solicitud ID:", currentSolicitud.id_solicitud);
    
        // 1. Crear un registro con la información de la solicitud rechazada
        const registroData = {
            id_solicitud: currentSolicitud.id_solicitud,
            placa_vehiculo: currentSolicitud.placa_vehiculo,
            fecha_solicitud: currentSolicitud.fecha_solicitud,
            estado: 'rechazada',
            observaciones: updatedSolicitud.observaciones,
            prioridad: currentSolicitud.prioridad,
            fecha_cambio_estado: new Date(), // Fecha actual
        };
    
        const [registro, error] = await createRegistro(registroData); // Llamada a la función de servicio para crear el registro
        if (error) {
            console.error("Error al crear el registro:", error);
            return;
        }
    
        // 2. Eliminar la solicitud después de crear el registro
        await deleteSolicitud(currentSolicitud.id_solicitud);
    
        // 3. Actualizar el estado de la solicitud en el frontend
        setSolicitudes((prev) =>
            prev.filter((sol) => sol.id_solicitud !== currentSolicitud.id_solicitud)
        );
        setShowRejectPopup(false);
    };
    

    const solicitudesConNombreConductor = solicitudes.map(solicitud => {
        const rutSolicitud = solicitud.rut_conductor ? solicitud.rut_conductor.replace(/[^\d-]+/g, "") : null;  
        const conductor = rutSolicitud ? conductores.find(conductor => conductor.rut_conductor === rutSolicitud) : null;

        return {
            ...solicitud,
            nombre_conductor: conductor && conductor.nombre ? conductor.nombre : 'Desconocido', 
        };
    });

    console.log("Solicitudes - Solicitudes con nombre de conductor:", solicitudesConNombreConductor);

    const filteredSolicitudes = solicitudesConNombreConductor
        .filter((solicitud) => solicitud.estado === 'pendiente')
        .filter((solicitud) => solicitud.id_solicitud.toString().includes(filterId));

    console.log("Solicitudes - Solicitudes filtradas:", filteredSolicitudes);
    
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de solicitud'/>
                    </div>
                </div>
                <SolicitudesTable
                    data={filteredSolicitudes}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            </div>
            {showAcceptPopup && (
                <AcceptPopup
                    show={showAcceptPopup}
                    setShow={setShowAcceptPopup}
                    data={[currentSolicitud]}
                    vehiculos={vehiculos}
                    conductores={conductores}
                    action={handleConfirmAccept}
                />
            )}

            {showRejectPopup && (
                <RejectPopup
                    show={showRejectPopup}
                    setShow={setShowRejectPopup}
                    data={[currentSolicitud]}
                    action={handleConfirmReject}
                />
            )}
        </div>
    );
};

export default Solicitudes;
