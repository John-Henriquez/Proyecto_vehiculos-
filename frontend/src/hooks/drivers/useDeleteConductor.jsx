import { useState, useEffect } from 'react';
import { deleteConductor } from '@services/conductores.service.js';
import { showWarningAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteConductor = () => {
    const removeConductor = async (rut) => {
        try {
            const response = await deleteConductor(rut);
            if (response?.status === 'Success') {
                showSuccessAlert("¡Éxito!", "Conductor eliminado correctamente");
            } else {
                showWarningAlert("Error", response.message || "No se pudo eliminar el conductor");
            }
        } catch (error) {
            console.error('Error al eliminar conductor:', error);
            showWarningAlert("Error", "Error al eliminar conductor");
        }
    };

    return { removeConductor };
};

export default useDeleteConductor;
