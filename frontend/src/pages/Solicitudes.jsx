import { useState, useEffect } from 'react';
import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { getAllSolicitudes, updateSolicitud } from '../services/solicitudes.service.js';
import { getAllVehiculos } from '../services/vehiculos.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import AcceptPopup from '../components/AcceptPopUp.jsx';
import RejectPopup from '../components/RejectPopUp.jsx';
import { acceptSolicitud, rejectSolicitud } from '../services/solicitudes.service.js';

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

                console.log("Solicitudes - Solicitudes cargadas:", fetchedSolicitudes);

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
                console.log("Solicitudes - Vehículos cargados:", fetchedVehiculos);
                setVehiculos(fetchedVehiculos);
            } catch (error) {
                console.error('Error al obtener los vehículos:', error);
            }
        };
    
        fetchSolicitudes();
        fetchVehiculos();
    }, []);
    
    const handleAccept = (solicitud) => {
        console.log("handleAccept - Solicitud seleccionada para aceptar:", solicitud);
        setCurrentSolicitud(solicitud); 
        setShowAcceptPopup(true); 
    };

    const handleReject = (solicitud) => {
        console.log("handleReject - Solicitud seleccionada para rechazar:", solicitud);
        setCurrentSolicitud(solicitud); 
        setShowRejectPopup(true); 
        console.log("handleReject - currentSolicitud ", solicitud);
    };
    

    const handleConfirmAccept = async (updatedSolicitud) => {
        console.log("Confirmando aceptación para la solicitud ID:", currentSolicitud.id_solicitud);
    
        // 1. Actualizar la solicitud con los nuevos datos
        const updatedData = {
            ...currentSolicitud,
            placa_patente: updatedSolicitud.placa_vehiculo,
            estado: 'aceptada',
            observaciones: updatedSolicitud.observaciones,
            rut_conductor: updatedSolicitud.rut_conductor,
        };
    
        try {
            // 2. Llamar a la función de actualización de solicitud
            const updatedSolicitudData = await acceptSolicitud(currentSolicitud.id_solicitud, updatedData);
    
            if (updatedSolicitudData?.message) {
                console.error("Error al actualizar la solicitud:", updatedSolicitudData.message);
                return;
            }
    
            // 3. Eliminar la solicitud del estado (se eliminan del frontend)
            setSolicitudes((prev) =>
                prev.filter((sol) => sol.id_solicitud !== updatedData.id_solicitud)
            );
    
            setShowAcceptPopup(false);
        } catch (error) {
            console.error("Error en el proceso de aceptación:", error);
        }
    };
    
    const handleConfirmReject = async (updatedSolicitud) => {
        console.log("Confirmando rechazo para la solicitud ID:", currentSolicitud.id_solicitud);
    
        // 1. Actualizar la solicitud con los nuevos datos
        const updatedData = {
            ...currentSolicitud,
            estado: 'rechazada',
            observaciones: updatedSolicitud.observaciones,
            fecha_cambio_estado: new Date(), // Fecha de cambio de estado
        };
        console.log("handleConfirmReject - currentSolicitud ", currentSolicitud);
    
        try {
            // 2. Llamar a la función de actualización de solicitud
            const updatedSolicitudData = await rejectSolicitud(currentSolicitud.id_solicitud, updatedData);
    
            if (updatedSolicitudData?.message) {
                console.error("Error al actualizar la solicitud:", updatedSolicitudData.message);
                return;
            }
    
            // 3. Eliminar la solicitud del estado (se eliminan del frontend)
            setSolicitudes((prev) =>
                prev.filter((sol) => sol.id_solicitud !== updatedData.id_solicitud)
            );
    
            setShowRejectPopup(false);
        } catch (error) {
            console.error("Error en el proceso de rechazo:", error);
        }
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
                    data={solicitudes
                        .filter(sol => sol.estado === 'pendiente')
                        .filter(sol => sol.id_solicitud.toString().includes(filterId)
                    )}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />

            </div>
            {showAcceptPopup && (
                <AcceptPopup
                    show={showAcceptPopup}
                    setShow={setShowAcceptPopup}
                    data={currentSolicitud}
                    vehiculos={vehiculos}
                    conductores={conductores}
                    action={handleConfirmAccept}
                />
            )}

            {showRejectPopup && (
                <RejectPopup
                    show={showRejectPopup}
                    setShow={setShowRejectPopup}
                    data={currentSolicitud}
                    action={handleConfirmReject}
                />
            )}
        </div>
    );
};

export default Solicitudes;
