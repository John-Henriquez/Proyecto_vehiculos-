import { useState } from 'react';
import { createTipoVehiculo } from '../../services/tipoVehiculo.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const useCreateTipoVehiculo = (onSuccess) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateTipoVehiculo = async (tipoVehiculoData) => {
        setIsLoading(true);
        try {
            await createTipoVehiculo(tipoVehiculoData);
            showSuccessAlert('Éxito', 'Tipo de vehículo creado exitosamente');
            onSuccess(); // Refrescar lista de vehículos
        } catch (error) {
            showErrorAlert('Error', error.response?.data?.message || 'Error al crear el tipo de vehículo');
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateTipoVehiculo, isLoading };
};

export default useCreateTipoVehiculo;
