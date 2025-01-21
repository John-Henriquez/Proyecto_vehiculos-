import { useState, useEffect } from 'react';
import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { getAllSolicitudes, acceptSolicitud, rejectSolicitud } from '../services/solicitudes.service.js';
import { getAllVehiculos } from '../services/vehiculos.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import AcceptPopup from '../components/AcceptPopUp.jsx';
import RejectPopup from '../components/RejectPopUp.jsx';

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
        setCurrentSolicitud(solicitud); 
        setShowAcceptPopup(true); 
    };

    const handleReject = (solicitud) => {
        setCurrentSolicitud(solicitud); 
        setShowRejectPopup(true); 
    };

    const handleConfirmAccept = async (updatedSolicitud) => {
        await acceptSolicitud(currentSolicitud.id_solicitud, updatedSolicitud);
        setSolicitudes((prev) =>
            prev.map((sol) =>
                sol.id_solicitud === currentSolicitud.id_solicitud
                    ? { ...sol, estado: 'aceptada', observaciones: updatedSolicitud.observaciones }
                    : sol
            )
        );
        setShowAcceptPopup(false);
    };

    const handleConfirmReject = async (updatedSolicitud) => {
        await rejectSolicitud(currentSolicitud.id_solicitud, updatedSolicitud);
        setSolicitudes((prev) =>
            prev.map((sol) =>
                sol.id_solicitud === currentSolicitud.id_solicitud
                    ? { ...sol, estado: 'rechazada', observaciones: updatedSolicitud.observaciones }
                    : sol
            )
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

    const filteredSolicitudes = solicitudesConNombreConductor
        .filter((solicitud) => solicitud.estado === 'pendiente')
        .filter((solicitud) => solicitud.id_solicitud.toString().includes(filterId));

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
