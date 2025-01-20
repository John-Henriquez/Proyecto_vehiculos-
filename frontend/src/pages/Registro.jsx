import RegistrosTable from '../components/RegistroTable.jsx';
import Search from '../components/Search.jsx';
import { useState, useEffect } from 'react';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos.jsx';
import FiltroVehiculo from '../components/FiltroVehiculo.jsx';  
import { getAllRegistros } from '../services/registro.service.js';
import axios from '../services/root.service.js';

const RegistroSolicitudes = () => {
    const [registros, setRegistros] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [filterId, setFilterId] = useState('');
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        const fetchRegistros = async () => {
            const fetchedRegistros = await getAllRegistros();
            console.log('Registros obtenidos:', fetchedRegistros);

            if (Array.isArray(fetchedRegistros)) {
                setRegistros(fetchedRegistros);

            } else {
                console.error('La respuesta de registros no es un arreglo:', fetchedRegistros);
                setRegistros([]); 
            }
        };
        
        const fetchVehiculos = async () => {
            try {
                const vehiculosResponse = await axios.get('/vehicle');
                console.log('Vehículos obtenidos:', vehiculosResponse.data);
                setVehiculos(vehiculosResponse.data);
            } catch (error) {
                console.error('Error al obtener los vehículos:', error);
            }
        };

        fetchRegistros();
        fetchVehiculos();
    }, []);

    const registrosConVehiculos = registros.map(registro => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.placa === registro.placa_vehiculo);
        return {
            ...registro,
            tipo_vehiculo: vehiculo ? vehiculo.id_tipo_vehiculo : '', 
        };
    });

    const registrosFiltrados = registrosConVehiculos
        .filter((registro) => registro.id_registro.toString().includes(filterId)) 
        .filter((registro) => filterType ? registro.tipo_vehiculo === filterType : true); 

    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo);
    };

    

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registro de Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de registro'/>
                        <FiltroVehiculo onChange={handleTipoVehiculoChange} />
                    </div>
                </div>
                <RegistrosTable data={registrosFiltrados} />
            </div>
        </div>
    );
};

export default RegistroSolicitudes;
