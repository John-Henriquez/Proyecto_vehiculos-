import { useState } from "react";
import { createVehiculo } from '../../services/vehiculos.service';
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

const useCreateVehiculo = (setVehiculos) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (newVehiculoData) => {
    if (!newVehiculoData || !newVehiculoData.placa || !newVehiculoData.capacidad_maxima) {
      setError("Datos incompletos. Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createVehiculo(newVehiculoData);
      if (response) {
        setVehiculos((prevState) => [...prevState, { ...response }]);
        showSuccessAlert("¡Éxito!", "Vehículo creado correctamente.");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Error al crear el vehículo");
      showErrorAlert("Error", "No se pudo crear el vehículo.");
      console.error("Error al crear vehículo:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreate, loading, error };
};

export default useCreateVehiculo;
