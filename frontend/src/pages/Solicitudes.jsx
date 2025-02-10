import { useState, useEffect, useCallback } from 'react';
import useUsers from '../hooks/users/useGetUsers.jsx';
import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { getSolicitudesByCategoria, updateSolicitud } from '../services/solicitudes.service.js';
import { getAllVehiculos } from '../services/vehiculos.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import useDeleteSolicitud from '../hooks/applications/useDeleteSolicitud.jsx';
import AcceptPopup from '../components/AcceptPopUp.jsx';
import RejectPopup from '../components/RejectPopUp.jsx';
import { acceptSolicitud, rejectSolicitud } from '../services/solicitudes.service.js';
import EditPopup from '../components/EditPopUp.jsx';
import '../styles/Solicitudes.css'; 


const Solicitudes = () => {
    const { users } = useUsers();
    const { conductores } = useGetConductores();
    const [solicitudes, setSolicitudes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [categoria, setCategoria] = useState('movilizacion');

    const [filterId, setFilterId] = useState('');
    const [filterName, setFilterName] = useState('');

    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);

    const [selectedSolicitudes, setSelectedSolicitudes] = useState([]);

    const [showEditPopup, setShowEditPopup] = useState(false);
    
    const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));
    const esAdmin = usuarioLogueado?.rol === 'administrador';
    const usuarioRut = usuarioLogueado?.rut;
    
    const fetchSolicitudes = useCallback(async () => {
        try {
            const fetchedSolicitudes = await getSolicitudesByCategoria(categoria);
            if (Array.isArray(fetchedSolicitudes)) {
                const filteredSolicitudes = esAdmin
                    ? fetchedSolicitudes.filter(sol => sol.estado === "pendiente")
                    : fetchedSolicitudes.filter(sol => sol.rut_creador === usuarioRut);
                setSolicitudes(filteredSolicitudes);
            } else {
                console.error('La respuesta no es un arreglo válido');
            }
        } catch (error) {
            console.error(`Error al obtener solicitudes de la categoría ${categoria}:`, error);
            setSolicitudes([]);
        }
    }, [categoria, esAdmin, usuarioRut]);

    const { handleDelete } = useDeleteSolicitud(fetchSolicitudes, setSelectedSolicitudes);

    useEffect(() => {
        fetchSolicitudes();
        const fetchVehiculos = async () => {
            try {
                const fetchedVehiculos = await getAllVehiculos();
                setVehiculos(fetchedVehiculos);
            } catch (error) {
                console.error('Error al obtener vehículos:', error);
            }
        };
        fetchVehiculos();
    }, [fetchSolicitudes]);
    
    const handleAccept = (solicitud) => {
        console.log("handleAccept - Solicitud seleccionada para aceptar:", solicitud);
        setCurrentSolicitud(solicitud); 
        setShowAcceptPopup(true); 
        console.log("handleAccept - solicitud ", solicitud);
    };

    const handleReject = (solicitud) => {
        console.log("handleReject - Solicitud seleccionada para rechazar:", solicitud);
        setCurrentSolicitud(solicitud); 
        setShowRejectPopup(true); 
        console.log("handleReject - solicitud ", solicitud);

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
            fecha_cambio_estado: new Date(), 
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

    const filteredSolicitudes = (esAdmin 
        ? solicitudes.filter(sol => sol.estado === 'pendiente') 
        : solicitudes.filter(sol => sol.rut_creador === usuarioRut)
    ).filter(sol => 
        (filterId ? sol.id_solicitud.toString().includes(filterId) : true) &&
        (filterName ? sol.nombre_agrupacion.toLowerCase().includes(filterName.toLowerCase()) : true) 
    );

    const handleEdit = (solicitud) => {
        setCurrentSolicitud(solicitud);
        setShowEditPopup(true);
      };
      
      const handleConfirmEdit = async (formData) => {
        try {
          await updateSolicitud(currentSolicitud.id_solicitud, formData);
          await fetchSolicitudes(); // Refresca los datos
          setShowEditPopup(false);
        } catch (error) {
          console.error("Error al actualizar la solicitud:", error);
        }
      };

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                <h1 className='title-table'>Solicitudes de {categoria === 'movilizacion' ? 'Movilización' : 'Maquinaria'}</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID'/>
                        <Search value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder='Filtrar por Nombre'/>
                    </div>
                    <div className="category-buttons">
                        <button 
                            className={`category-btn ${categoria === 'movilizacion' ? 'active' : ''}`} 
                            onClick={() => setCategoria('movilizacion')} 
                            disabled={categoria === 'movilizacion'}
                        >
                            Movilización
                        </button>
                        <button 
                            className={`category-btn ${categoria === 'maquinaria' ? 'active' : ''}`} 
                            onClick={() => setCategoria('maquinaria')} 
                            disabled={categoria === 'maquinaria'}
                        >
                            Maquinaria
                        </button>
                    </div>
                </div>
                <SolicitudesTable
                    data={filteredSolicitudes}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    esAdmin={esAdmin}
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
            {showEditPopup && (
                <EditPopup
                    show={showEditPopup}
                    setShow={setShowEditPopup}
                    data={currentSolicitud}
                    action={handleConfirmEdit}
                />
            )}
        </div>
    );
};
export default Solicitudes;