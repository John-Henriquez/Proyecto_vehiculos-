import axios from './root.service.js';

export async function getAllConductores() {
    try {
        const { data } = await axios.get('/driver/'); 
        return data; 
    } catch (error) {
        return error.response?.data || { message: "Error al obtener los conductores" };
    }
}

export async function getConductor(rut_conductor) {
    try {
        const { data } = await axios.get(`/driver/${rut_conductor}`);
        return data.data;
    } catch (error) {
        return error.response?.data || { message: `Error al obtener el conductor ${rut_conductor}` };
    }
}
