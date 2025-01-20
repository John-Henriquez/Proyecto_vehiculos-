import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import axios from "../services/root.service.js";

const FiltroVehiculo = ({ onChange }) => {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  useEffect(() => {
    const fetchDatosVehiculo = async () => {
      try {
        const [tiposResponse, vehiculosResponse] = await Promise.all([
          axios.get("/tipos-vehiculos"),
          axios.get("/vehicle"),
        ]);
        setTiposVehiculo(tiposResponse.data);
        setVehiculos(vehiculosResponse.data);
      } catch (error) {
        console.error("Error al obtener los datos de vehículos:", error);
      }
    };

    fetchDatosVehiculo();
  }, []);

  const handleTipoChange = (event) => {
    const tipo = event.target.value;
    setTipoSeleccionado(tipo);
    onChange(tipo); 
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de Vehículo</InputLabel>
      <Select
        value={tipoSeleccionado || ""}
        onChange={handleTipoChange}
        label="Tipo de Vehículo"
      >
        <MenuItem value="">Todos</MenuItem>
        {tiposVehiculo.map((tipo) => (
          <MenuItem key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
            {tipo.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FiltroVehiculo;
