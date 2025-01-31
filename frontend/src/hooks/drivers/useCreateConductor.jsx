import { useState } from "react";
import { createConductor } from '@services/conductores.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useCreateConductor = (setConductores) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newConductorData) => {
        if (!newConductorData || !newConductorData.rut_conductor || !newConductorData.nombre) {
            setError("Datos incompletos. Por favor, complete todos los campos.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await createConductor(newConductorData);
            if (response?.status === 'Success') {
                setConductores((prevState) => [...prevState, { ...response.data }]);
                showSuccessAlert("¡Éxito!", "Conductor creado correctamente.");
            } else {
                throw new Error(response.message || "Error al crear el conductor");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error al crear el conductor");
            showErrorAlert("Error", "No se pudo crear el conductor.");
            console.error("Error al crear conductor:", error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateConductor;