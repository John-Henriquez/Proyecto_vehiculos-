import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";

export default function VehiculosTable({ data, onEdit, onDelete, onAdd }) {
  // Usar el hook para obtener los tipos de vehículos
  const { tiposVehiculos, loading, error } = useGetTiposVehiculos();
  
  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculos?.find((t) => t.id_tipo_vehiculo === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  useEffect(() => {
    // Asegurarse de que los tipos de vehículos se hayan cargado correctamente
    if (error) {
      console.error("Error al cargar los tipos de vehículos:", error);
    }
  }, [error]);

  return (
    <>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: "10px" }}>
        Añadir Vehículo
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Capacidad Máxima</TableCell>
              <TableCell>Tipo Vehículo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.placa}>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.marca}</TableCell>
                  <TableCell>{row.modelo}</TableCell>
                  <TableCell>{row.capacidad_maxima}</TableCell>
                  <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay vehículos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
