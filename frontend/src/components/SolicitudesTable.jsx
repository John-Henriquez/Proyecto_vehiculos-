import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function SolicitudesTable({ data, onAccept, onReject }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Solicitud</TableCell>
            <TableCell>Nombre Agrupación</TableCell>
            <TableCell>Número Teléfono</TableCell>
            <TableCell>Fecha Solicitud</TableCell>
            <TableCell>Fecha Salida</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Vehículo</TableCell>
            <TableCell>Nombre Conductor</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id_solicitud}>
              <TableCell>{row.id_solicitud}</TableCell>
              <TableCell>{row.nombre_agrupacion}</TableCell>
              <TableCell>{row.num_telefono}</TableCell>
              <TableCell>{row.fecha_solicitud}</TableCell>
              <TableCell>{row.fecha_salida}</TableCell>
              <TableCell>{row.destino}</TableCell>
              <TableCell>{row.placa_patente}</TableCell>
              <TableCell>{row.nombre_conductor}</TableCell>
              <TableCell>
                {row.estado === "pendiente" && (
                  <>
                    <IconButton color="success" onClick={() => onAccept(row.id_solicitud)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onReject(row.id_solicitud)}>
                      <CloseIcon />
                    </IconButton>
                  </>
                )}
                {row.estado !== "pendiente" && <span>{row.estado}</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
