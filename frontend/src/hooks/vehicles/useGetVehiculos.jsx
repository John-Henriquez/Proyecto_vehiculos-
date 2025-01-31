import { useState, useEffect } from "react";
import { getAllVehiculos } from '../../services/vehiculos.service';
import { showWarningAlert } from "@helpers/sweetAlert.js";

const useGetVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);

  const formatVehiculoData = (vehiculo) => ({
    placa: vehiculo.placa,
    marca: vehiculo.marca || "",
    modelo: vehiculo.modelo || "",
    capacidad_maxima: vehiculo.capacidad_maxima,
    estado: vehiculo.estado,
    id_tipo_vehiculo: vehiculo.id_tipo_vehiculo,
    año_fabricacion: vehiculo.año_fabricacion,
  });
 
  const fetchVehiculos = async () => {
    try {
      const response = await getAllVehiculos();
      if (!Array.isArray(response)) {
        return showWarningAlert("Advertencia", "No existen registros de vehículos");
      }

      const formattedData = response.map(formatVehiculoData);
      setVehiculos(formattedData);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
      showWarningAlert("Error", "Error al obtener vehículos");
    }
  };

  console.log(vehiculos);

  useEffect(() => {
    fetchVehiculos();
  }, []);

  return { vehiculos, fetchVehiculos, setVehiculos };
};

export default useGetVehiculos;
