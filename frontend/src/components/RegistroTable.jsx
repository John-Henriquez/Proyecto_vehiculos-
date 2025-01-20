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

export default function RegistrosTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Registro</TableCell>
            <TableCell>Placa Vehículo</TableCell>
            <TableCell>Fecha Solicitud</TableCell>
            <TableCell>Observaciones</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map((row) => (
            <TableRow key={row.id_registro}>
              <TableCell>{row.id_registro}</TableCell>
              <TableCell>{row.placa_vehiculo}</TableCell>
              <TableCell>{row.fecha_solicitud}</TableCell>
              <TableCell>{row.observaciones || "Sin observaciones"}</TableCell>
              <TableCell>{row.prioridad}</TableCell>
              <TableCell>{row.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
