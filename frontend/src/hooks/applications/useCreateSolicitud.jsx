import { useState } from 'react';
import { createSolicitud } from '@services/solicitudes.service.js';

const useCreateSolicitud = (setSolicitudes) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (newSolicitudData) => {
        if (!newSolicitudData ||
            !newSolicitudData.rut_solicitante ||
            !newSolicitudData.destino ||
            !newSolicitudData.fecha_solicitud) {
                setError("Datos incompletos. Por favor, complete todos los campos.");
                return;
            }

        setLoading(true);
        setError(null);

        try {
            const response = await createSolicitud(newSolicitudData);

            if (response) {
                setSolicitudes(prevState => [...prevState, { ...response}]);
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Error al crear solicitud');
            console.error('Error al crear solicitud:', error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error };
};

export default useCreateSolicitud;