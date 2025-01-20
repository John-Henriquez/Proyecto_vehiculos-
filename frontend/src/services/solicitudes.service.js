import axios from './root.service.js';
import { formatSolicitudData } from '@helpers/formatSolicitudData.js';


export async function getAllSolicitudes() {
    try {
        const { data } = await axios.get('/application/');
        const formattedData = data.data.map(formatSolicitudData); 
        return formattedData;
    } catch (error) {
        return error.response?.data || { message: "Error al obtener las solicitudes" };
    }
}


export async function getSolicitud(id_solicitud) {
    try {
        const { data } = await axios.get(`/application/${id_solicitud}`);
        return formatSolicitudData(data.data); 
    } catch (error) {
        return error.response?.data || { message: `Error al obtener la solicitud ${id_solicitud}` };
    }
}


export async function createSolicitud(solicitudData) {
    try {
        const { data } = await axios.post('/application/add', solicitudData);
        return formatSolicitudData(data.data); 
    } catch (error) {
        return error.response?.data || { message: "Error al crear la solicitud" };
    }
}


export async function updateSolicitud(id_solicitud, solicitudData) {
    try {
        const { data } = await axios.put(`/application/edit/${id_solicitud}`, solicitudData);
        return formatSolicitudData(data.data); 
    } catch (error) {
        return error.response?.data || { message: `Error al actualizar la solicitud ${idSolicitud}` };
    }
}


export async function deleteSolicitud(id_solicitud) {
    try {
        const { data } = await axios.delete(`/application/delete/${id_solicitud}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al eliminar la solicitud ${id_solicitud}` };
    }
}

export async function acceptSolicitud(id_solicitud){
    try{
        const { data } = await axios.patch(`/application/edit/${id_solicitud}`, {estado: 'aprobada'});
        return formatSolicitudData(data.data);
    }catch(error){
        return error.response?.data || { message: `Error al aceptar la solicitud ${id_solicitud}` };
    }
}

export async function rejectSolicitud(id_solicitud){
    try{
        const { data } = await axios.patch(`/application/edit/${id_solicitud}`, {estado: 'rechazada'});
        return formatSolicitudData(data.data);
    }catch(error){
        return error.response?.data || { message: `Error al rechazar la solicitud ${id_solicitud}` };
    }
}
 