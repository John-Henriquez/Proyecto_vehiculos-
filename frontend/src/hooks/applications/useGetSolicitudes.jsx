import { useState, useEffect } from 'react';
import { getAllSolicitudes } from '@services/solicitudes.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);

    const formatSolicitudData = (solicitud) => ({
        id_solicitud: solicitud.id_solicitud,
        rut_solicitante: solicitud.rut_solicitante,
        fecha_solicitud: solicitud.fecha_solicitud,
        estado: solicitud.estado,
        destino: solicitud.destino,
        prioridad: solicitud.prioridad
    });

    const fetchSolicitudes = async () => {
        try {
            // Cambié 'getSolicitudes()' a 'getAllSolicitudes()' para que coincida con la importación
            const response = await getAllSolicitudes(); 
            if (!Array.isArray(response)) {
                return showWarningAlert("Advertencia", "No existen registros de solicitudes");
            }

            const formattedData = response.map(formatSolicitudData);
            setSolicitudes(formattedData);
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            showWarningAlert("error", "Error al obtener solicitudes");
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    return { solicitudes, fetchSolicitudes, setSolicitudes };
};

export default useGetSolicitudes;
