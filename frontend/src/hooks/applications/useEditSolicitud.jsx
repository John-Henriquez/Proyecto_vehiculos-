import { useState } from 'react';
import { updateSolicitud } from '@services/solicitudes.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditSolicitud = (fetchSolicitudes, setSolicitudes) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataSolicitud, setDataSolicitud] = useState({});

    const handleClickUpdate = () => {
        if (dataSolicitud && dataSolicitud.id_solicitud) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedSolicitudData) => {
        if (!updatedSolicitudData?.id_solicitud) {
            showErrorAlert('Error', 'Falta el ID de la solicitud.');
            return;
        }

        try {
            const updatedSolicitud = await updateSolicitud(updatedSolicitudData.id_solicitud, updatedSolicitudData);

            showSuccessAlert('¡Actualizado!', 'La solicitud ha sido actualizada correctamente.');
            setIsPopupOpen(false);

            setSolicitudes(prevSolicitudes => prevSolicitudes.map(solicitud =>
                solicitud.id_solicitud === updatedSolicitud.id_solicitud
                    ? { ...updatedSolicitud }
                    : solicitud
            ));

            await fetchSolicitudes();
            setDataSolicitud({});
        } catch (error) {
            console.error('Error al actualizar la solicitud:', error);
            showErrorAlert('Error', `No se pudo actualizar la solicitud: ${error.message}`);
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataSolicitud,
        setDataSolicitud
    };
};

export default useEditSolicitud;
