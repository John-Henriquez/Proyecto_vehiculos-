import { deleteVehiculo } from "@services/vehiculo.service.js";
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useDeleteVehiculo = (fetchVehiculos, setSelectedVehiculos) => {
  const handleDelete = async (vehiculos) => {
    if (!vehiculos || vehiculos.length === 0) {
      showErrorAlert("Error", "No se seleccionó ningún vehículo para eliminar.");
      return;
    }

    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteVehiculo(vehiculos[0].placa);

        if (response.status === "Client error") {
          return showErrorAlert("Error", response.details);
        }

        showSuccessAlert("¡Eliminado!", "El vehículo ha sido eliminado correctamente.");
        await fetchVehiculos();
        setSelectedVehiculos([]);
      } else {
        showErrorAlert("Cancelado", "La operación fue cancelada.");
      }
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      showErrorAlert("Error", "No se pudo eliminar el vehículo.");
    }
  };

  return { handleDelete };
};

export default useDeleteVehiculo;
