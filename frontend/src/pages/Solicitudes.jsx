import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
import { useState,useEffect } from 'react';
import { getAllSolicitudes, acceptSolicitud, rejectSolicitud } from '../services/solicitudes.service.js';
import useGetConductores  from '../hooks/drivers/useGetConductores.jsx';
import FiltroVehiculo from '../components/FiltroVehiculo.jsx';
import axios from '../services/root.service.js'; 

const Solicitudes = () => {
    const { conductores } = useGetConductores();
    const [solicitudes, setSolicitudes] = useState([]);
    const [filterId, setFilterId] = useState('');
    const [filterType, setFilterType] = useState('');
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const fetchedSolicitudes = await getAllSolicitudes();
            if (Array.isArray(fetchedSolicitudes)) {
                setSolicitudes(fetchedSolicitudes);
            } else {
                console.error('La respuesta de solicitudes no es un arreglo:', fetchedSolicitudes);
            }
        };
        const fetcVehiculos = async () => {
            try{
                const vehiculosResponse = await axios.get('/vehicle');
                setVehiculos(vehiculosResponse.data);
            }catch (error){
                console.error('Error al obtener los vehiculos:', error);
            }
        };
        
        fetchSolicitudes();
        fetcVehiculos();
    }, []);

     const handleAccept = async (id) => {
        const updatedSolicitud = await acceptSolicitud(id);
        setSolicitudes((prev) => 
            prev.map((solicitud) =>
                solicitud.id_solicitud === id ? { ...solicitud, estado: updatedSolicitud.estado } : solicitud
            )
        );
     };

    const handleReject = async (id) => {
        const updatedSolicitud = await rejectSolicitud(id);
        setSolicitudes((prev) => 
            prev.map((solicitud) =>
                solicitud.id_solicitud === id ? { ...solicitud, estado: updatedSolicitud.estado } : solicitud
            )
        );
    };

    const solicitudesConNombreConductor = solicitudes.map(solicitud => {
        const rutSolicitud = solicitud.rut_conductor.replace(/[^\d-]+/g, "");  
        const conductor = conductores.find(conductor => conductor.rut_conductor === rutSolicitud);

        return {
            ...solicitud,
            nombre_conductor: conductor && conductor.nombre ? conductor.nombre : 'Desconocido', 
        };
    });

    const filteredSolicitudes = solicitudesConNombreConductor
    .filter((solicitud) => solicitud.estado === 'pendiente')
    .filter((solicitud) => solicitud.id_solicitud.toString().includes(filterId))
    .filter((solicitud) => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.placa === solicitud.placa_vehiculo);
        return vehiculo && (filterType ? vehiculo.id_tipo_vehiculo === filterType : true);
    });

    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo);
    }

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de solicitud'/>

                        <FiltroVehiculo onChange={handleTipoVehiculoChange} />
                    </div>
                </div>
                <SolicitudesTable
                    data={filteredSolicitudes}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            </div>
        </div>
    );
};

export default Solicitudes;

