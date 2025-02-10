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
        const { data } = await axios.post('/tipos-vehiculos/', tipoVehiculoData);
        return data;
    } catch (error) {
        console.error('Error al crear un tipo de vehículo:', error);
        throw error;
    }
}

