import { useState } from 'react';
import { updateConductor } from '@services/conductores.service.js';
import { showWarningAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditConductor = (setSelectedConductor) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataConductor, setDataConductor] = useState(null);

    const handleClickUpdate = () => {
        if (dataConductor?.rut) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedConductorData) => {
        if (!updatedConductorData?.rut) {
            showWarningAlert("Error", "Falta el RUT del conductor.");
            return;
        }

        try {
            const updatedConductor = await updateConductor(updatedConductorData.rut, updatedConductorData);
            showSuccessAlert("¡Actualizado!", "El conductor ha sido actualizado correctamente.");

            setSelectedConductor(updatedConductor);

            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error al actualizar conductor:', error);
            showWarningAlert("Error", "Error al actualizar conductor");
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataConductor,
        setDataConductor,
    };
};

export default useEditConductor;
