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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

export default function RegistrosTable({ data, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Registro</TableCell>
            <TableCell>Nombre Agrupación</TableCell>
            <TableCell>Número Teléfono</TableCell>
            <TableCell>Fecha Creación</TableCell>
            <TableCell>Fecha Salida</TableCell>
            <TableCell>Fecha Regreso</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Vehículo Asignado</TableCell>
            <TableCell>Conductor</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id_registro}>
                <TableCell>{row.id_registro}</TableCell>
                <TableCell>{row.nombre_agrupacion || "-"}</TableCell>
                <TableCell>{row.num_telefono || "-"}</TableCell>
                <TableCell>{formatDate(row.fecha_solicitud)}</TableCell>
                <TableCell>{formatDate(row.fecha_salida)}</TableCell>
                <TableCell>{row.fecha_regreso ? formatDate(row.fecha_regreso) : "No disponible"}</TableCell>
                <TableCell>{row.destino || "Sin destino"}</TableCell>
                <TableCell>{row.placa_vehiculo || "No asignado"}</TableCell>
                <TableCell>{row.conductor || "Desconocido"}</TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "5px" }}>
                  <IconButton color="primary" onClick={() => onEdit(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row.id_registro)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} align="center">
                No hay registros disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
