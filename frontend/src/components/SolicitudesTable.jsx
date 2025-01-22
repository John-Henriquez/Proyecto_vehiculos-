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

export default function SolicitudesTable({ data, onAccept, onReject }) {
  const { tiposVehiculos } = useGetTiposVehiculos();

  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculos.find((t) => t.id_tipo_vehiculo === id);
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
            <TableCell>Fecha Solicitud</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Tipo Vehículo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id_solicitud}>
              <TableCell>{row.id_solicitud}</TableCell>
              <TableCell>{row.nombre_agrupacion}</TableCell>
              <TableCell>{row.numero_telefono}</TableCell>
              <TableCell>{row.fecha_creacion}</TableCell>
              <TableCell>{row.destino}</TableCell>
              <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
              <TableCell>
                {row.estado === "pendiente" ? (
                  <>
                    <IconButton color="success" onClick={() => onAccept(row.id_solicitud)}>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
