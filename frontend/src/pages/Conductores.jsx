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

    // Hook para editar conductores
    const {
        isPopupOpen: showPopup,
        setIsPopupOpen: setShowPopup,
        dataConductor: selectedConductor,
        setDataConductor: setSelectedConductor,
        handleUpdate,
        loading: editLoading,
        error: editError,
    } = useEditConductor(setConductores);

    // Hook para crear conductores
    const { handleCreate, loading: createLoading, error: createError } = useCreateConductor(setConductores);

    // Hook para eliminar conductores
    const { handleDelete, loading: deleteLoading, error: deleteError } = useDeleteConductor(fetchConductores, setConductores);

    // Filtrar conductores por RUT
    const filteredConductores = conductores.filter((conductor) =>
        conductor.rut_conductor.toLowerCase().includes(filterRut.toLowerCase())
    );

    // Manejar errores globales
    if (error || createError || editError || deleteError) {
        showWarningAlert("Error", error || createError || editError || deleteError);
        return <div>Error al cargar o manipular los conductores</div>;
    }

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Conductores</h1>
                    <div className='filter-actions'>
                        <Search 
                            value={filterRut} 
                            onChange={(e) => setFilterRut(e.target.value)} 
                            placeholder='Filtrar por RUT'
                        />
                        <button onClick={() => {
                            setSelectedConductor(null); // Limpia el conductor seleccionado
                            setShowPopup(true); // Abre el popup
                        }} className='btn-add'>Agregar Conductor</button>
                    </div>
                </div>

                {loading ? (
                    <div>Cargando...</div>
                ) : (
                    <ConductoresTable
                        data={filteredConductores}
                        onEdit={(conductor) => {
                            setSelectedConductor(conductor); // Establece el conductor a editar
                            setShowPopup(true); // Abre el popup
                        }}
                        onDelete={handleDelete} // Pasa la función para eliminar conductores
                    />
                )}
            </div>
            <PopupConductor 
                show={showPopup} 
                setShow={setShowPopup} 
                data={selectedConductor} 
                action={selectedConductor ? handleUpdate : handleCreate}
                loading={editLoading || createLoading} // Muestra el estado de carga del popup
            />
        </div>
    );
};

export default Conductores;