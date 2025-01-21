import axios from '../services/root.service.js'

export async function getAllVehiculos() {
    try{
        const {data} = await axios.get('/vehicle/');
        return data;
    }catch(error){
        console.error("Error al obtener los vehiculos:", error);
        throw error.response?.data || {message: "Error al obtener los vehiculos"};
    }
}