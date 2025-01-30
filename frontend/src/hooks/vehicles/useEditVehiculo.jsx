import { useState } from "react";
import { updateVehiculo } from '../../services/vehiculos.service';
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useEditVehiculo = (setVehiculos) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataVehiculo, setDataVehiculo] = useState(null);

  const handleClickUpdate = () => {
    if (dataVehiculo?.placa) {
        setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedVehiculoData) => {
    if (!updatedVehiculoData?.placa) {
        showErrorAlert("Error", "Falta la placa del vehículo.");
        return;
    }

    try {
        const parsedData = {
            ...updatedVehiculoData,
            capacidad_maxima: Number(updatedVehiculoData.capacidad_maxima),
            id_tipo_vehiculo: Number(updatedVehiculoData.id_tipo_vehiculo)
        };

        // Corregido: Eliminado destructuring incorrecto
        const updatedVehiculo = await updateVehiculo(parsedData.placa, parsedData);
        console.log("Respuesta de la API:", updatedVehiculo);
       
        if (!updatedVehiculo?.placa) {
          console.log(updatedVehiculoData.placa);
          throw new Error("Respuesta inválida de la API");
        }
       
        showSuccessAlert("¡Actualizado!", "El vehículo ha sido actualizado correctamente.");
        setIsPopupOpen(false);

        setVehiculos((prevVehiculos = []) =>
          prevVehiculos.map((vehiculo) =>
            vehiculo.placa === updatedVehiculo.placa
              ? { ...vehiculo, ...updatedVehiculo }
              : vehiculo
          )
        );
    } catch (error) {
        console.error("Error al actualizar:", error);
        showErrorAlert("Error", error.response?.data?.message || error.message);
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