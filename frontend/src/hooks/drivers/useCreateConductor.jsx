import { useState } from 'react';
import { createConductor } from '@services/conductores.service.js';
import { showSuccessAlert, showWarningAlert } from '@helpers/sweetAlert.js';

const useCreateConductor = () => {
    const addConductor = async (conductor) => {
        try {
            const response = await createConductor(conductor);
            if (response?.status === 'Success') {
                showSuccessAlert("Éxito", "Conductor agregado correctamente");
            } else {
                showWarningAlert("Error", response.message || "No se pudo agregar el conductor");
            }
        } catch (error) {
            console.error('Error al agregar conductor:', error);
            showWarningAlert("Error", "Error al agregar conductor");
        }
    };

    return { addConductor };
};
 
export default useCreateConductor;
