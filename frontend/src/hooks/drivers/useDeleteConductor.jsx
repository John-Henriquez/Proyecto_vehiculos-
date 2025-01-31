import { useState } from "react";
import { deleteConductor } from '@services/conductores.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteConductor = (fetchConductores, setConductores) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async (conductor) => {
        if (!conductor?.rut_conductor) {
            showErrorAlert("Error", "No se seleccionó ningún conductor para eliminar.");
            return;
        }

        try {
            const result = await deleteDataAlert();
            if (result.isConfirmed) {
                setLoading(true);
                setError(null);

                const response = await deleteConductor(conductor.rut_conductor);
                if (response?.status !== 'Success') {
                    throw new Error(response.message || "Error al eliminar el conductor");
                }

                showSuccessAlert("¡Eliminado!", "El conductor ha sido eliminado correctamente.");
                await fetchConductores();
                setConductores((prevConductores) =>
                    prevConductores.filter((c) => c.rut_conductor !== conductor.rut_conductor)
                );
            } else {
                showErrorAlert("Cancelado", "La operación fue cancelada.");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al eliminar el conductor");
            showErrorAlert("Error", "No se pudo eliminar el conductor");
            console.error("Error al eliminar conductor:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
};

export default useDeleteConductor;