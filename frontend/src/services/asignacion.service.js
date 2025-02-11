import axios from './root.service.js';

// Obtener todas las asignaciones
export async function getAllAsignaciones() {
    try {
        const { data } = await axios.get('/asignacion/'); 
        console.log("Asignaciones:", data);
        return data; 
    } catch (error) {
        return error.response?.data || { message: "Error al obtener las asignaciones" };
    }
}

// Obtener una asignación por ID
export async function getAsignacionById(id) {
    try {
        const { data } = await axios.get(`/asignacion/${id}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al obtener la asignación con ID ${id}` };
    }
}

// Crear una nueva asignación
export async function createAsignacion(asignacion) {
    try {
        const { data } = await axios.post('/asignacion/add', asignacion);
        return data;
    } catch (error) {
        return error.response?.data || { message: "Error al crear la asignación" };
    }
}

// Actualizar una asignación existente
export async function updateAsignacion(id, asignacion) {
    try {
        const { data } = await axios.put(`/asignacion/edit/${id}`, asignacion);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al actualizar la asignación con ID ${id}` };
    }
}

// Eliminar una asignación
export async function deleteAsignacion(id) {
    try {
        const { data } = await axios.delete(`/asignacion/delete/${id}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: `Error al eliminar la asignación con ID ${id}` };
    }
}

// Obtener disponibilidad de vehículos y conductores
export async function getDisponibilidad(fecha_salida, fecha_regreso) {
    try {
        const { data } = await axios.get('/asignacion/availability', {
            params: { fecha_salida, fecha_regreso }
        });
        return data; // Los datos incluirán los vehículos y conductores disponibles y ocupados
    } catch (error) {
        return error.response?.data || { message: "Error al verificar la disponibilidad de vehículos y conductores" };
    }
}

// Obtener fechas asignadas para un conductor o un vehículo
export async function getAssignedDates(rut_conductor, placa) {
    try {
        const { data } = await axios.get('/asignacion/assigned-dates', {
            params: { rut_conductor, placa }
        });
        return data.data; // Retorna solo el array de fechas
    } catch (error) {
        return error.response?.data || { message: "Error al obtener las fechas asignadas" };
    }
}
