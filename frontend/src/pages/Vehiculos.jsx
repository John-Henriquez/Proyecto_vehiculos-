import { useState } from 'react';
import VehiculosTable from '../components/VehiculosTable';
import useVehiculos from '../hooks/vehicles/useGetVehiculos';
import FiltroVehiculo from '../components/FiltroVehiculo';
import Search from '../components/Search';
import { showWarningAlert } from '../helpers/sweetAlert'; 
import PopupVehiculo from '../components/vehiculosPopUp';
import useEditVehiculo from '../hooks/vehicles/useEditVehiculo';

const Vehiculos = () => {
    const { vehiculos = [], loading, error, setVehiculos } = useVehiculos();
    const [filterPlaca, setFilterPlaca] = useState('');
    const [filterType, setFilterType] = useState('');

    const handleSearch = (e) => {
        setFilterPlaca(e.target.value);
    };
    
    const {
        isPopupOpen: showPopup,
        setIsPopupOpen: setShowPopup,
        dataVehiculo: selectedVehiculo,
        setDataVehiculo: setSelectedVehiculo,
        handleUpdate
    } = useEditVehiculo(setVehiculos);

    const handleEdit = (vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setShowPopup(true);
    };

    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo ? Number(tipo) : null);
    };

    const filteredData = vehiculos
        .filter(vehiculo => 
            vehiculo.placa.toString().includes(filterPlaca.toLowerCase())) 
        .filter(vehiculo => filterType ? vehiculo.id_tipo_vehiculo === filterType : true); 

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
                        onEdit={handleEdit}
                    />
                )}
            </div>
            <PopupVehiculo 
                show={showPopup} 
                setShow={setShowPopup} 
                data={selectedVehiculo} 
                action={handleUpdate}
            />
        </div>
    );
};

export default Vehiculos;