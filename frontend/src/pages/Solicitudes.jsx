import { useState, useEffect } from 'react';
import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { getAllSolicitudes } from '../services/solicitudes.service.js';
import { getAllVehiculos } from '../services/vehiculos.service.js';
import { createRegistro } from '../services/registro.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import AcceptPopup from '../components/AcceptPopUp.jsx';
import RejectPopup from '../components/RejectPopUp.jsx';

const Solicitudes = () => {
    const { conductores } = useGetConductores();
    const [solicitudes, setSolicitudes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [filterId, setFilterId] = useState('');
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const fetchedSolicitudes = await getAllSolicitudes();
                console.log('Solicitudes - Respuesta de solicitudes:', fetchedSolicitudes);

                if (Array.isArray(fetchedSolicitudes)) {
                    setSolicitudes(fetchedSolicitudes);
                } else {
                    console.error('La respuesta de solicitudes no contiene un arreglo válido');
                }
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
                setSolicitudes([]);
            }
        };
        
        const fetchVehiculos = async () => {
            try {
                const fetchedVehiculos = await getAllVehiculos();
                setVehiculos(fetchedVehiculos);
            } catch (error) {
                console.error('Error al obtener los vehículos:', error);
            }
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
            fecha_cambio_estado: new Date(), 
        };
    
        const [registro, error] = await createRegistro(registroData); 
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
            fecha_cambio_estado: new Date(), 
        };
    
        const [registro, error] = await createRegistro(registroData); 
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
                    data={solicitudes.filter(sol => 
                        sol.id_solicitud.toString().includes(filterId)
                    )}
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
