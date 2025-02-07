import { deleteSolicitud } from '@services/solicitudes.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteSolicitud = (fetchSolicitudes, setSelectedSolicitudes) => {
    const handleDelete = async (id_solicitud) => {
        if (!id_solicitud) {
            showErrorAlert('Error', 'No se seleccionó ninguna solicitud para eliminar.');
            return;
        }

        try {
            const result = await deleteDataAlert();
            if (result.isConfirmed) {
                const response = await deleteSolicitud(id_solicitud);

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert('¡Eliminado!', 'La solicitud ha sido eliminada correctamente.');
                await fetchSolicitudes();
                setSelectedSolicitudes([]);
            } else {
                showErrorAlert('Cancelado', 'La operación fue cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
            showErrorAlert('Error', 'No se pudo eliminar la solicitud.');
        }
    };

    return { handleDelete };
};

export default useDeleteSolicitud;
