import axios from './root.service.js'

export async function getTiposVehiculos () {
    try {
        const { data } = await axios.get('/tipos-vehiculos/');  
        return data; 
    } catch (error) {
        console.error(error);
        console.error('Error al obtener los tipos de vehículos:', error);
        throw error;  
    }
};

export async function createTipoVehiculo(tipoVehiculoData) {
    try {
        const { data } = await axios.post('/tipos-vehiculos/add', tipoVehiculoData);
        return data;
    } catch (error) {
        console.error('Error al crear un tipo de vehículo:', error);
        throw error;
    }
}

export async function updateTipoVehiculo(id_tipo_vehiculo, tipoVehiculoData) {
    try {
        const { data } = await axios.patch(`/tipos-vehiculos/${id_tipo_vehiculo}`, tipoVehiculoData);
        return data;
    } catch (error) {
        console.error('Error al actualizar el tipo de vehículo:', error);
        throw error;
    }
}

export async function deleteTipoVehiculo(id_tipo_vehiculo) {
    try {
        const { data } = await axios.delete(`/tipos-vehiculos/${id_tipo_vehiculo}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar el tipo de vehículo:', error);
        throw error;
    }
}
