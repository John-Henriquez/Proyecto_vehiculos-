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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function VehiculosTable({ data, onEdit, onDelete, onAdd }) {
  return (
    <>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: "10px" }}>
        Añadir Vehículo
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Vehículo</TableCell>
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
                <TableRow key={row.id_vehiculo}>
                  <TableCell>{row.id_vehiculo}</TableCell>
                  <TableCell>{row.placa_patente}</TableCell>
                  <TableCell>{row.marca}</TableCell>
                  <TableCell>{row.modelo}</TableCell>
                  <TableCell>{row.capacidad_maxima}</TableCell>
                  <TableCell>{row.tipo_vehiculo}</TableCell>
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
                <TableCell colSpan={8} align="center">
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