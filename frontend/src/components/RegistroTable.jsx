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

const adjustToLocalTimezone = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Convertir minutos a milisegundos
  return new Date(date.getTime() + offset);
};

const formatDate = (date, format = "DD-MM-YYYY") => {
  if (!date) return "-";
  const parsedDate = adjustToLocalTimezone(date);
  if (isNaN(parsedDate.getTime())) return "-"; // Verificar si la fecha es válida
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Meses empiezan en 0
  const year = parsedDate.getFullYear();
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  if (format === "DD-MM-YYYY") {
    return `${day}-${month}-${year}`;
  } else if (format === "DD-MM-YYYY HH:mm") {
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  return "-";
};

// Función para formatear RUTs
const formatRut = (rut) => {
  if (!rut) return "-";
  return rut.replace(/\./g, "").replace(/-/g, "").replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, "$1.$2.$3-$4");
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
            <TableCell>Número Teléfono</TableCell>
            <TableCell>Fecha Creacion</TableCell>
            <TableCell>Fecha Salida</TableCell>
            <TableCell>Fecha Regreso</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Vehiculo Asigado</TableCell>
            <TableCell>Conductor</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
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
              <TableCell>{row.fecha_regreso ? formatDate(row.fecha_regreso) : "No disponible"}</TableCell>
              <TableCell>{row.destino}</TableCell>
              <TableCell>{row.placa_vehiculo}</TableCell> 
              <TableCell>{getConductorName(row.rut_conductor)}</TableCell> 
              <TableCell>{row.estado}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
