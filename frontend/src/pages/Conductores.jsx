import { useState } from 'react';
import ConductoresTable from '../components/ConductoresTable';
import useGetConductores from '../hooks/drivers/useGetConductores';
import Search from '../components/Search';
import { showWarningAlert } from '../helpers/sweetAlert';
import PopupConductor from '../components/conductoresPopUp';
import useEditConductor from '../hooks/drivers/useEditConductor';
import useDeleteConductor from '../hooks/drivers/useDeleteConductor';
import useCreateConductor from '../hooks/drivers/useCreateConductor';

const Conductores = () => {
    const { conductores = [], loading, error, setConductores, fetchConductores } = useGetConductores();
    const [filterRut, setFilterRut] = useState('');

    const handleSearch = (e) => {
        setFilterRut(e.target.value);
    };
    
    const {
        isPopupOpen: showPopup,
        setIsPopupOpen: setShowPopup,
        dataConductor: selectedConductor,
        setDataConductor: setSelectedConductor,
        handleUpdate
    } = useEditConductor(setConductores);

    const { handleCreate } = useCreateConductor(setConductores);

    const handleEdit = (conductor) => {
        setSelectedConductor(conductor);
        setShowPopup(true);
    };

    const handleCreateNew = () => {
        setSelectedConductor(null);
        setShowPopup(true);
    };

    const { handleDelete } = useDeleteConductor(fetchConductores, setConductores);
    
    if (error) {
        showWarningAlert("Error", error);
        return <div>Error al cargar los conductores</div>;
    }

    console.log('setSelectedConductor:', setSelectedConductor);
    
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Conductores</h1>
                    <div className='filter-actions'>
                        <Search 
                            value={filterRut} 
                            onChange={handleSearch} 
                            placeholder='Filtrar por RUT'
                        />
                        <button onClick={handleCreateNew} className='btn-add'>Agregar Conductor</button>
                    </div>
                </div>
                
                {loading ? (
                    <div>Cargando...</div> 
                ) : (
                    <ConductoresTable
                        data={conductores}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
            <PopupConductor 
                show={showPopup} 
                setShow={setShowPopup} 
                data={selectedConductor} 
                action={selectedConductor ? handleUpdate : handleCreate}
            />
        </div>
    );
};

export default Conductores;
