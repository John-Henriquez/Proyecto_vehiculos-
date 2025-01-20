import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import axios from "../services/root.service.js";

const FiltroVehiculo = ({ onChange }) => {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      try {
        const { data } = await axios.get("/tipos-vehiculos");
        setTiposVehiculo(data); 
      } catch (error) {
        console.error("Error al obtener los tipos de vehículos:", error);
      }
    };

    fetchTiposVehiculo();
  }, []);

  const handleChange = (event) => {
    const tipo = event.target.value;
    setTipoSeleccionado(tipo);
    onChange(tipo); 
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de Vehículo</InputLabel>
      <Select
        value={tipoSeleccionado || ""}
        onChange={handleChange}
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
