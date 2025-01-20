import axios from './root.service.js';  

export async function getAllRegistros() {
    try {
        const { data } = await axios.get('/record/'); 
        return data;  
    } catch (error) {
        return error.response?.data || { message: "Error al obtener los registros" };
    }
}

export async function getRegistro(id_registro) {
    try {
        const { data } = await axios.get(`/record/${id_registro}`);
        return data;  
    } catch (error) {
        return error.response?.data || { message: `Error al obtener el registro ${id_registro}` };
    }
}

export async function createRegistro(registroData) {
    try {
        const { data } = await axios.post('/record/add', registroData);
        return data; 
    } catch (error) {
        return error.response?.data || { message: "Error al crear el registro" };
    }
}

export async function updateRegistro(id_registro, registroData) {
    try {
        const { data } = await axios.patch(`/record/edit/${id_registro}`, registroData);
        return data;  
    } catch (error) {
        return error.response?.data || { message: `Error al actualizar el registro ${id_registro}` };
    }
}

export async function deleteRegistro(id_registro) {
    try {
        const { data } = await axios.delete(`/record/delete/${id_registro}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al eliminar el registro ${id_registro}` };
    }
}

export async function acceptRegistro(id_registro) {
    try {
        const { data } = await axios.patch(`/record/edit/${id_registro}`, { estado: 'aprobada' });
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al aceptar el registro ${id_registro}` };
    }
}

export async function rejectRegistro(id_registro) {
    try {
        const { data } = await axios.patch(`/record/edit/${id_registro}`, { estado: 'rechazada' });
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al rechazar el registro ${id_registro}` };
    }
}
