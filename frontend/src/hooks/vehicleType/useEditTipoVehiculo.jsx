import { useState } from 'react';
import { updateTipoVehiculo } from '../../services/tipoVehiculo.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const useEditTipoVehiculo = (onSuccess) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleEditTipoVehiculo = async (id_tipo_vehiculo, tipoVehiculoData) => {
        setIsLoading(true);
        try {
            await updateTipoVehiculo(id_tipo_vehiculo, tipoVehiculoData);
            showSuccessAlert('Éxito', 'Tipo de vehículo actualizado exitosamente');
            onSuccess(); // Refrescar lista de tipos de vehículos
        } catch (error) {
            showErrorAlert('Error', error.response?.data?.message || 'Error al actualizar el tipo de vehículo');
        } finally {
            setIsLoading(false);
        }
    };

    return { handleEditTipoVehiculo, isLoading };
};

export default useEditTipoVehiculo;
