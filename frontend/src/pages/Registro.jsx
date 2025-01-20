import RegistrosTable from '../components/RegistroTable.jsx';
import Search from '../components/Search.jsx';
import { getAllSolicitudes } from '../services/solicitudes.service.js';  
import { useState, useEffect } from 'react';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos.jsx';
import FiltroVehiculo from '../components/FiltroVehiculo.jsx';

const RegistroSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const { tiposVehiculos, fetchTipoVehiculo } = useGetTiposVehiculos();
    const [filtroTipoVehiculo, setFiltroTipoVehiculo] = useState('');
    const [filterId, setFilterId] = useState('');

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const fetchedSolicitudes = await getAllSolicitudes();
            if (Array.isArray(fetchedSolicitudes)) {
                setSolicitudes(fetchedSolicitudes);
            } else {
                console.error('La respuesta de solicitudes no es un arreglo:', fetchedSolicitudes);
                setSolicitudes([]); 
            }
        };
        fetchSolicitudes();
    }, []);

    useEffect(() => {
        fetchTipoVehiculo();
    }, []);
    
    const solicitudesRegistradas = solicitudes.filter((solicitud) => {
        const esAprobadaORechazada = solicitud.estado === 'aprobada' || solicitud.estado === 'rechazada';
        const coincideTipoVehiculo = filtroTipoVehiculo ? solicitud.tipo_vehiculo === filtroTipoVehiculo : true; 
        return esAprobadaORechazada && coincideTipoVehiculo;
    });

    const solicitudesFiltradas = solicitudesRegistradas.map(solicitud => ({
        placa_vehiculo: solicitud.placa_patente,
        fecha_solicitud: solicitud.fecha_solicitud,
        estado: solicitud.estado,
        observaciones: solicitud.observaciones,
        prioridad: solicitud.prioridad,
    }));

    // Definir un manejador de cambios para el filtro de tipo de vehículo
    const handleTipoVehiculoChange = (e) => {
        setFiltroTipoVehiculo(e.target.value);
    };

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registro de Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de solicitud'/>
                        <FiltroVehiculo onChange={handleTipoVehiculoChange} />
                    </div>
                </div>
                <RegistrosTable data={solicitudesFiltradas} />
            </div>
        </div>
    );
};

export default RegistroSolicitudes;
