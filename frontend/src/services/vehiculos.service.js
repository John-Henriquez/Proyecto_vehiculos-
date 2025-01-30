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

export async function updateVehiculo(placa, vehiculoData) {
    try {
        const { data } = await axios.patch(`/vehicle/edit/${placa}`, vehiculoData);
        console.log("vehiculos.service - Respuesta de la API:", data);
        return data;
    } catch (error) {
        console.error("Error al editar el vehículo:", error);
        throw error.response?.data || { message: "Error al editar el vehículo" };
    }
}