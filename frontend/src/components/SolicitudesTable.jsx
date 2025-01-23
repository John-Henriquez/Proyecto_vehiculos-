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
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";


const formatDate = (date) => {
  if (!date) return "-"; 
  return date;
};

export default function SolicitudesTable({ data, onAccept, onReject }) {
  const { tiposVehiculos } = useGetTiposVehiculos();

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
            <TableCell>Fecha Creacion</TableCell>
            <TableCell>Fecha Salida</TableCell>
            <TableCell>Fecha Llegada</TableCell>            
            <TableCell>Destino</TableCell>
            <TableCell>Tipo Vehículo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length > 0 ? data.map((row) => (
            <TableRow key={row.id_solicitud}>
              <TableCell>{row.id_solicitud}</TableCell>
              <TableCell>{row.nombre_agrupacion || "-"}</TableCell>
              <TableCell>{row.numero_telefono || "-"}</TableCell>
              <TableCell>{formatDate(row.fechaSolicitud)}</TableCell>
              <TableCell>{formatDate(row.fechaSalida)}</TableCell>
              <TableCell>{formatDate(row.fecha_regreso)}</TableCell>
              <TableCell>{row.destino || "Sin destino"}</TableCell>
              <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
              <TableCell>
                {row.estado === "pendiente" ? (
                  <>
                    <IconButton color="success" onClick={() => onAccept(row)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onReject(row.id_solicitud)}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <span>{row.estado}</span>
                )}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No hay solicitudes disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
