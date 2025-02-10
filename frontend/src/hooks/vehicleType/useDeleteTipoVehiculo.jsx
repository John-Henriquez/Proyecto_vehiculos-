import { useState } from 'react';
import { deleteTipoVehiculo } from '../../services/tipoVehiculo.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const useDeleteTipoVehiculo = (onSuccess) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTipoVehiculo = async (id_tipo_vehiculo) => {
        setIsLoading(true);
        try {
            await deleteTipoVehiculo(id_tipo_vehiculo);
            showSuccessAlert('Éxito', 'Tipo de vehículo eliminado exitosamente');
            onSuccess(); // Refrescar lista de tipos de vehículos
        } catch (error) {
            showErrorAlert('Error', error.response?.data?.message || 'Error al eliminar el tipo de vehículo');
        } finally {
            setIsLoading(false);
        }
    };

    return { handleDeleteTipoVehiculo, isLoading };
};

export default useDeleteTipoVehiculo;
