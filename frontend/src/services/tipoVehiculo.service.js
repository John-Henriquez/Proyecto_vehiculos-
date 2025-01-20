import axios from './root.service.js'

export async function getTiposVehiculos () {
    try {
        const { data } = await axios.get('/tipos-vehiculos');  
        return data; 
    } catch (error) {
        console.error(error);
        console.error('Error al obtener los tipos de vehículos:', error);
        throw error;  
    }
};
