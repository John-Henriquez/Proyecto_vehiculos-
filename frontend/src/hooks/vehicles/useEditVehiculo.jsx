import { useState } from "react";
import { updateVehiculo } from "@services/vehiculo.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useEditVehiculo = (fetchVehiculos, setVehiculos) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataVehiculo, setDataVehiculo] = useState({});

  const handleClickUpdate = () => {
    if (dataVehiculo && dataVehiculo.placa) {
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedVehiculoData) => {
    if (!updatedVehiculoData?.placa) {
      showErrorAlert("Error", "Falta la placa del vehículo.");
      return;
    }

    try {
      const updatedVehiculo = await updateVehiculo(updatedVehiculoData.placa, updatedVehiculoData);

      showSuccessAlert("¡Actualizado!", "El vehículo ha sido actualizado correctamente.");
      setIsPopupOpen(false);

      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.placa === updatedVehiculo.placa ? { ...updatedVehiculo } : vehiculo
        )
      );

      await fetchVehiculos();
      setDataVehiculo({});
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      showErrorAlert("Error", `No se pudo actualizar el vehículo: ${error.message}`);
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataVehiculo,
    setDataVehiculo,
  };
};

export default useEditVehiculo;
