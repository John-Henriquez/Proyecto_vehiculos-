import React, { useState, useEffect } from "react";
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
  Pagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";

export default function VehiculosTable({ data, onEdit, onDelete, onAdd }) {
  // Usar el hook para obtener los tipos de vehículos
  const { tiposVehiculos, loading, error } = useGetTiposVehiculos();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  
  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculos?.find((t) => t.id_tipo_vehiculo === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  useEffect(() => {
    setCurrentPage(1);
    if (error) {
      console.error("Error al cargar los tipos de vehículos:", error);
    }
  }, [data, error]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.slice(startIndex, endIndex) || [];

  return (
    <>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: "10px" }}>
        Añadir Vehículo
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <TableRow key={row.placa}>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.marca}</TableCell>
                  <TableCell>{row.modelo}</TableCell>
                  <TableCell>{row.capacidad_maxima}</TableCell>
                  <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
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
                <TableCell colSpan={7} align="center">
                  No hay vehículos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data?.length > itemsPerPage && (
        <Pagination
          count={Math.ceil((data?.length || 0) / itemsPerPage)}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </>
  );
}
