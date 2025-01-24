import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";

const formatDate = (date) => {
  if (!date) return "-";
  return date;
};

export default function RegistrosTable({ data, conductores, vehiculos }) {


  const conductoresMap = conductores.reduce((acc, conductor) => {
    acc[conductor.rut_conductor] = conductor.nombre;
    return acc;
  }, {});

  const getConductorName = (rut) => {
    return conductoresMap[rut] || "Desconocido";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Registro</TableCell>
            <TableCell>Nombre Agrupación</TableCell>
            <TableCell>N° Teléfono</TableCell>
            <TableCell>Fecha Ingreso</TableCell>
            <TableCell>Fecha Salida</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Vehiculo Asigado</TableCell>
            <TableCell>Conductor</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No hay registros disponibles
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id_registro}>
              <TableCell>{row.id_registro}</TableCell>
              <TableCell>{row.nombre_agrupacion}</TableCell>
              <TableCell>{row.num_telefono}</TableCell>
              <TableCell>{formatDate(row.fecha_solicitud)}</TableCell>
              <TableCell>{formatDate(row.fecha_salida)}</TableCell>
              <TableCell>{row.destino}</TableCell>
              <TableCell>{row.placa_vehiculo}</TableCell> {/* Muestra la placa del vehículo */}
              <TableCell>{getConductorName(row.rut_conductor)}</TableCell> {/* Muestra el nombre del conductor */}
              <TableCell>{row.estado}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
