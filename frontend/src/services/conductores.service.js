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
export async function createConductor(conductor) {
    try {
        const { data } = await axios.post('/driver/', conductor);
        return data;
    } catch (error) {
        return error.response?.data || { message: "Error al crear el conductor" };
    }
}

export async function updateConductor(rut_conductor, conductor) {
    try {
        const { data } = await axios.put(`/driver/${rut_conductor}`, conductor);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al actualizar el conductor ${rut_conductor}` };
    }
}

export async function deleteConductor(rut_conductor) {
    try {
        const { data } = await axios.delete(`/driver/${rut_conductor}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al eliminar el conductor ${rut_conductor}` };
    }
}

