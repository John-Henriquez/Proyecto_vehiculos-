import { useState, useEffect } from 'react';
import VehiculosTable from '../components/VehiculosTable';
import useVehiculos from '../hooks/vehicles/useGetVehiculos';
import FiltroVehiculo from '../components/FiltroVehiculo';
import Search from '../components/Search';
import { showWarningAlert } from '../helpers/sweetAlert'; 

const Vehiculos = () => {
    const { vehiculos, loading, error } = useVehiculos();
    const [filterPlaca, setFilterPlaca] = useState('');
    const [filterType, setFilterType] = useState('');

    const handleSearch = (e) => {
        setFilterPlaca(e.target.value);
    };

    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo);
    };

    const filteredData = vehiculos
        .filter(vehiculo => vehiculo.placa.toString().includes(filterPlaca.toLowerCase())) // Filtro por placa
        .filter(vehiculo => filterType ? vehiculo.id_tipo_vehiculo === filterType : true); // Filtro por tipo de vehículo

    if (error) {
        showWarningAlert("Error", error);
        return <div>Error al cargar los vehículos</div>;
    }

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Vehículos</h1>
                    <div className='filter-actions'>
                        <Search 
                            value={filterPlaca} 
                            onChange={handleSearch} 
                            placeholder='Filtrar por ID de vehículo'
                        />
                        <FiltroVehiculo 
                            onChange={handleTipoVehiculoChange}  
                        />
                    </div>
                </div>
                
                {loading ? (
                    <div>Cargando...</div> 
                ) : (
                    <VehiculosTable
                        data={filteredData}
                    />
                )}
            </div>
        </div>
    );
};

export default Vehiculos;