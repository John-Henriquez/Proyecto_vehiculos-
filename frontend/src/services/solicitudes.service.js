import axios from './root.service.js';


export async function getAllSolicitudes() {
    try {
        const { data } = await axios.get('/solicitudes/');
        const formattedData = data.data.map(formatSolicitudData); // Formato opcional
        return formattedData;
    } catch (error) {
        return error.response?.data || { message: "Error al obtener las solicitudes" };
    }
}


export async function getSolicitud(idSolicitud) {
    try {
        const { data } = await axios.get(`/solicitudes/${idSolicitud}`);
        return formatSolicitudData(data.data); // Formato opcional
    } catch (error) {
        return error.response?.data || { message: `Error al obtener la solicitud ${idSolicitud}` };
    }
}


export async function createSolicitud(solicitudData) {
    try {
        const { data } = await axios.post('/solicitudes/add', solicitudData);
        return formatSolicitudData(data.data); // Formato opcional
    } catch (error) {
        return error.response?.data || { message: "Error al crear la solicitud" };
    }
}


export async function updateSolicitud(idSolicitud, solicitudData) {
    try {
        const { data } = await axios.put(`/solicitudes/edit/${idSolicitud}`, solicitudData);
        return formatSolicitudData(data.data); // Formato opcional
    } catch (error) {
        return error.response?.data || { message: `Error al actualizar la solicitud ${idSolicitud}` };
    }
}


export async function deleteSolicitud(idSolicitud) {
    try {
        const { data } = await axios.delete(`/solicitudes/delete/${idSolicitud}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al eliminar la solicitud ${idSolicitud}` };
    }
}


function formatSolicitudData(solicitud) {
    return {
        id: solicitud.id_solicitud,
        nombre: solicitud.nombre || "No especificado",
        estado: solicitud.estado || "Pendiente",
        fecha: solicitud.createdAt,
    };
}
