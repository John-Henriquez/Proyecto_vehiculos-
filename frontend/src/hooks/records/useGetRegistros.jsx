import { useState, useEffect } from "react";
import { getAllRegistros } from "@services/registro.service.js";
import { showWarningAlert } from "@helpers/sweetAlert.js";

const useGetRegistros = () => {
  const [registros, setRegistros] = useState([]);

  const formatRegistroData = (registro) => ({
    id_registro: registro.id_registro,
    placa_vehiculo: registro.placa_vehiculo,
    fecha_solicitud: registro.fecha_solicitud,
    estado: registro.estado,
    observaciones: registro.observaciones || "",  
  });

  const fetchRegistros = async () => {
    try {
      const response = await getAllRegistros();  
      if (!Array.isArray(response)) {
        return showWarningAlert("Advertencia", "No existen registros disponibles");
      }

      const formattedData = response.map(formatRegistroData);
      setRegistros(formattedData);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      showWarningAlert("error", "Error al obtener registros");
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);  

  return { registros, fetchRegistros, setRegistros };
};

export default useGetRegistros;
