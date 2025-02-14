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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";

const formatDate = (date) => {
  if (!date) return "-"; 
  return date;
};

export default function SolicitudesTable({ data, onAccept, onReject, onEdit, onDelete, esAdmin, categoria }) {
  const { tiposVehiculos } = useGetTiposVehiculos();
  console.log("Solicitudes:", data);

  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculos?.find((t) => t.id_tipo_vehiculo === id);
    return tipo ? tipo.nombre : "Desconocido";
  };


  return (
    <TableContainer component={Paper}>
      <Table>
      <TableHead>
  <TableRow>
    <TableCell>ID Solicitud</TableCell>
    <TableCell>Nombre Agrupación</TableCell>
    <TableCell>Número Teléfono</TableCell>
    <TableCell>Fecha Creación</TableCell>
    <TableCell>{categoria === "movilizacion" ? "Fecha Salida" : "Inicio Trabajo"}</TableCell>
    <TableCell>{categoria === "movilizacion" ? "Fecha Llegada" : "Fin Trabajo"}</TableCell>
    <TableCell>Destino</TableCell>
    <TableCell>Tipo Vehículo</TableCell>
    <TableCell>Cantidad Pasajeros</TableCell>
    {!esAdmin && <TableCell>Estado</TableCell>} {/* Columna adicional para usuarios */}
    <TableCell>Acciones</TableCell>
  </TableRow>
</TableHead>


<TableBody>
  {data?.length > 0 ? (
    data.map((row) => (
      <TableRow key={row.id_solicitud}>
        <TableCell>{row.id_solicitud}</TableCell>
        <TableCell>{row.nombre_agrupacion || "-"}</TableCell>
        <TableCell>{row.numero_telefono || "-"}</TableCell>
        <TableCell>{formatDate(row.fechaSolicitud)}</TableCell>
        <TableCell>{formatDate(row.fechaSalida)}</TableCell>
        <TableCell>{formatDate(row.fecha_regreso)}</TableCell>
        <TableCell>{row.destino || "Sin destino"}</TableCell>
        <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
        <TableCell>{row.cantidad_pasajeros || "-"}</TableCell>
        {!esAdmin && <TableCell>{row.estado}</TableCell>} {/* Celda adicional para estado */}
        <TableCell>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: "7px" }}>
    {esAdmin && row.estado === "pendiente" && (
      <>
        <IconButton color="success" onClick={() => onAccept(row)}>
          <CheckIcon />
        </IconButton>
        <IconButton color="error" onClick={() => onReject(row)}>
          <CloseIcon />
        </IconButton>
      </>
    )}
    {(esAdmin || row.estado === "pendiente") && (
      <IconButton color="primary" onClick={() => onEdit(row)}>
        <EditIcon />
      </IconButton>
    )}
    {(esAdmin || row.estado === "pendiente") && (
      <IconButton color="error" onClick={() => onDelete(row.id_solicitud)}>
        <DeleteIcon />
      </IconButton>
    )}
  </div>
</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={esAdmin ? 10 : 11} align="center">
        No hay solicitudes disponibles
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </TableContainer>
  );
}
