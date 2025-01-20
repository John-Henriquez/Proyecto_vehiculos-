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

export default function RegistrosTable({ data, onAccept, onReject }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Placa Vehículo</TableCell>
            <TableCell>Fecha Solicitud</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Observaciones</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id_registro}>
              <TableCell>{row.placa_vehiculo}</TableCell>
              <TableCell>{row.fecha_solicitud}</TableCell>
              <TableCell>{row.estado}</TableCell>
              <TableCell>{row.observaciones || "Sin observaciones"}</TableCell>
              <TableCell>
                {row.estado === "pendiente" && (
                  <>
                    <IconButton color="success" onClick={() => onAccept(row.id_registro)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onReject(row.id_registro)}>
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
