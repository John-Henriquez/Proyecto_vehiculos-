import Table from '../components/table.jsx';
import useGetSolicitudes from '../hooks/applications/useGetSolicitudes.jsx';
import Search from '../components/Search.jsx';
import Popup from '../components/Popup.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import { useCallback, useState } from 'react';
//import '@styles/solicitudes.css';
import useEditSolicitud from '../hooks/applications/useEditSolicitud.jsx';
import useDeleteSolicitud from '../hooks/applications/useDeleteSolicitud.jsx';

const Solicitudes = () => {
    const { solicitudes, fetchSolicitudes, setSolicitudes } = useGetSolicitudes();
    const [filterId, setFilterId] = useState('');

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataSolicitud,
        setDataSolicitud
    } = useEditSolicitud(setSolicitudes);

    const { handleDelete } = useDeleteSolicitud(fetchSolicitudes, setDataSolicitud);

    const handleIdFilterChange = (e) => {
        setFilterId(e.target.value);
    };

    const handleSelectionChange = useCallback((selectedSolicitudes) => {
        setDataSolicitud(selectedSolicitudes);
    }, [setDataSolicitud]);

    const colums = [
        { title: "ID Solicitud", field: "id_solicitud", width: 150, responsive: 0 },
        { title: "RUT Solicitante", field: "rut_solicitante", width: 200, responsive: 3 },
        { title: "Fecha Solicitud", field: "fecha_solicitud", width: 200, responsive: 2 },
        { title: "Estado", field: "estado", width: 150, responsive: 2 },
        { title: "Destino", field: "destino", width: 300, responsive: 2 },
        { title: "Prioridad", field: "prioridad", width: 150, responsive: 2 }
    ];

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={handleIdFilterChange} placeholder={'Filtrar por ID de solicitud'} />
                        <button onClick={handleClickUpdate} disabled={dataSolicitud.length === 0}>
                            {dataSolicitud.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button className='delete-solicitud-button' disabled={dataSolicitud.length === 0} onClick={() => handleDelete(dataSolicitud)}>
                            {dataSolicitud.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>
                <Table
                    data={solicitudes}
                    columns={colums}
                    filterId={filterId}
                    dataToFilter={'id_solicitud'}
                    initialSortName={'id_solicitud'}
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataSolicitud} action={handleUpdate} />
        </div>
    );
};

export default Solicitudes;

