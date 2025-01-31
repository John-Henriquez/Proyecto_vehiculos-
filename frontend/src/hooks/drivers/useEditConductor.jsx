import { useState } from "react";
import { updateConductor } from '@services/conductores.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useEditConductor = (setConductores) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataConductor, setDataConductor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClickUpdate = () => {
        if (dataConductor?.rut_conductor) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedConductorData) => {
        if (!updatedConductorData?.rut_conductor) {
            setError("Falta el RUT del conductor.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const parsedData = {
                ...updatedConductorData,
                telefono: String(updatedConductorData.telefono),
            };

            const response = await updateConductor(updatedConductorData.rut_conductor, parsedData);
            if (response?.status !== 'Success') {
                throw new Error(response.message || "Respuesta inválida de la API");
            }

            showSuccessAlert("¡Actualizado!", "El conductor ha sido actualizado correctamente.");
            setIsPopupOpen(false);

            setConductores((prevConductores) =>
                prevConductores.map((conductor) =>
                    conductor.rut_conductor === updatedConductorData.rut_conductor
                        ? { ...conductor, ...parsedData }
                        : conductor
                )
            );
        } catch (error) {
            setError(error?.response?.data?.message || "Error al actualizar el conductor");
            showErrorAlert("Error", "No se pudo actualizar el conductor");
            console.error("Error al actualizar conductor:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataConductor,
        setDataConductor,
        loading,
        error,
    };
};

export default useEditConductor;