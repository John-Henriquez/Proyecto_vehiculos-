import { useState, useEffect } from 'react';
import { getAllSolicitudes } from '@services/solicitudes.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);


    const formatSolicitudData = (solicitud) => ({
        id_solicitud: solicitud.id_solicitud,
        nombre_agrupacion: solicitud.nombre_agrupacion,
        num_telefono: solicitud.numero_telefono,            // Ajustado
        fecha_solicitud: solicitud.fechaSolicitud,          // Ajustado
        fecha_salida: solicitud.fechaSalida,                // Ajustado
        fecha_regreso: solicitud.fecha_regreso,
        destino: solicitud.destino,
        placa_patente: solicitud.placaPatente,              // Ajustado
        nombre_conductor: solicitud.nombre_conductor || "",
        rut_conductor: solicitud.rut_conductor || "",
        estado: solicitud.estado,
        prioridad: solicitud.prioridad,
        id_tipo_vehiculo: solicitud.id_tipo_vehiculo         // ¡Agregado!
      });
    const fetchSolicitudes = async () => {
        try {
            const response = await getAllSolicitudes(); 
            console.log('Respuesta cruda de la API:', response);
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
