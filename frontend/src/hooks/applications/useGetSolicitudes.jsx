import { useState, useEffect } from 'react';
import { getAllSolicitudes } from '@services/solicitudes.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);


    const formatSolicitudData = (solicitud) => ({
        id_solicitud: solicitud.id_solicitud,
        nombre_agrupacion: solicitud.nombre_agrupacion,
        num_telefono: solicitud.num_telefono,
        fecha_solicitud: solicitud.fecha_solicitud,
        fecha_salida: solicitud.fecha_salida,
        destino: solicitud.destino,
        placa_patente: solicitud.placa_patente,
        nombre_conductor: solicitud.nombre_conductor || "", 
        rut_conductor: solicitud.rut_conductor || "",
        estado: solicitud.estado,
        prioridad: solicitud.prioridad
    });

    const fetchSolicitudes = async () => {
        try {
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
