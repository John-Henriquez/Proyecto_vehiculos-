import axios from './root.service.js';
import { formatSolicitudData } from '@helpers/formatSolicitudData.js';

export async function getAllSolicitudes() {
    try {
        const { data } = await axios.get('/application/');
        console.log('Respuesta completa del backend:', data);
        
        if (data && Array.isArray(data.data)) {
            const formattedData = data.data.map(formatSolicitudData);
            console.log('Solicitudes formateadas:', formattedData);
            return formattedData;
        } else {
            console.error('La respuesta no contiene el formato esperado:', data);
            return [];
        }
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        return error.response?.data || { message: "Error al obtener las solicitudes" };
    }
}

export async function getSolicitud(id_solicitud) {
    try {
        const { data } = await axios.get(`/application/${id_solicitud}`);
        console.log(`Solicitud obtenida (ID: ${id_solicitud}):`, data);
        return formatSolicitudData(data.data); 
    } catch (error) {
        console.error(`Error al obtener la solicitud ${id_solicitud}:`, error);
        return error.response?.data || { message: `Error al obtener la solicitud ${id_solicitud}` };
    }
}

export const createSolicitud = async (data) => {
    try {
        console.log('Enviando datos de nueva solicitud:', data);
        const response = await axios.post('/application/add', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Respuesta al crear solicitud:', response.data);
        return { success: true, message: response.data.message || 'Solicitud creada correctamente' };
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Error al crear la solicitud',
        };
    }
};

export async function updateSolicitud(id_solicitud, solicitudData) {
    try {
        console.log(`Actualizando solicitud (ID: ${id_solicitud}) con datos:`, solicitudData);
        const { data } = await axios.put(`/application/edit/${id_solicitud}`, solicitudData);
        console.log('Solicitud actualizada:', data);
        return formatSolicitudData(data.data); 
    } catch (error) {
        console.error(`Error al actualizar la solicitud ${id_solicitud}:`, error);
        return error.response?.data || { message: `Error al actualizar la solicitud ${id_solicitud}` };
    }
}

export async function deleteSolicitud(id_solicitud) {
    try {
        const { data } = await axios.delete(`/application/delete/${id_solicitud}`);
        console.log('Solicitud eliminada:', data);
        return data;
    } catch (error) {
        console.error(`Error al eliminar la solicitud ${id_solicitud}:`, error);
        return error.response?.data || { message: `Error al eliminar la solicitud ${id_solicitud}` };
    }
}

export async function acceptSolicitud(id_solicitud) {
    try {
        console.log(`Aceptando solicitud (ID: ${id_solicitud})`);
        const { data } = await axios.patch(`/application/edit/${id_solicitud}`, { estado: 'aprobada' });
        console.log('Solicitud aceptada:', data);
        return formatSolicitudData(data.data);
    } catch (error) {
        console.error(`Error al aceptar la solicitud ${id_solicitud}:`, error);
        return error.response?.data || { message: `Error al aceptar la solicitud ${id_solicitud}` };
    }
}

export async function rejectSolicitud(id_solicitud) {
    try {
        console.log(`Rechazando solicitud (ID: ${id_solicitud})`);
        const { data } = await axios.patch(`/application/edit/${id_solicitud}`, { estado: 'rechazada' });
        console.log('Solicitud rechazada:', data);
        return formatSolicitudData(data.data);
    } catch (error) {
        console.error(`Error al rechazar la solicitud ${id_solicitud}:`, error);
        return error.response?.data || { message: `Error al rechazar la solicitud ${id_solicitud}` };
    }
}
