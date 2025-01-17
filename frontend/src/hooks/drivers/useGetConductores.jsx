import { useState, useEffect } from 'react';
import { getAllConductores } from '@services/conductores.service.js';
import { showWarningAlert } from '@helpers/sweetAlert.js';

const useGetConductores = () => {
    const [conductores, setConductores] = useState([]);

    const fetchConductores = async () => {
        try {
            const response = await getAllConductores();

            if (response?.status !== 'Success') {
                return showWarningAlert("Advertencia", "No se encontraron conductores");
            }

            setConductores(response.data); 
        } catch (error) {
            console.error('Error al obtener conductores:', error);
            showWarningAlert("error", "Error al obtener conductores");
        }
    };

    useEffect(() => {
        fetchConductores();
    }, []);

    return { conductores, fetchConductores, setConductores };
};

export default useGetConductores;
