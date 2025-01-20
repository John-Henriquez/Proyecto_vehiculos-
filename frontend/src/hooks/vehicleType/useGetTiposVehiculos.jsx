import { useState, useEffect } from 'react';
import { getTiposVehiculos } from '../../services/tipoVehiculo.service.js';  

const useGetTiposVehiculos = () => {
    const [tiposVehiculos, setTiposVehiculos] = useState([]);

    const fetchTipoVehiculo = async () => {
        try {
            const data = await getTiposVehiculos();  
            console.log('Tipos de vehículos obtenidos:', data);
            setTiposVehiculos(data);  
        } catch (error) {
            console.error('Error al obtener los tipos de vehículos:', error);
        }
    };

    useEffect(() => {
        fetchTipoVehiculo();  
    }, []);

    return { tiposVehiculos, fetchTipoVehiculo };
};

export default useGetTiposVehiculos;
