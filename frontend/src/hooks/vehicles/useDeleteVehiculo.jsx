import { deleteVehiculo } from '../../services/vehiculos.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useDeleteVehiculo = (fetchVehiculos, setVehiculos) => {
  const handleDelete = async (vehiculo) => {

    if (!vehiculo) {
      showErrorAlert("Error", "No se seleccionó ningún vehículo para eliminar.");
      return;
    }

    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteVehiculo(vehiculo.placa);

        if (response.status === "Client error") {
          return showErrorAlert("Error", response.details);
        }

        showSuccessAlert("¡Eliminado!", "El vehículo ha sido eliminado correctamente.");
        await fetchVehiculos();
        setVehiculos((prevVehiculos) => prevVehiculos.filter((vehiculo) => vehiculo.placa !== placa));
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
