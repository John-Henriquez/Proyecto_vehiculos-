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
  Pagination,
  CircularProgress,
  Typography,
  List, 
  ListItem, 
  ListItemText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useGetTiposVehiculos from "../hooks/vehicleType/useGetTiposVehiculos";
import useAssignedDates from "../hooks/assignments/useAssignedDates";

const FechasAsignadas = ({ placa }) => {
  const { assignedDates, loading, error } = useAssignedDates({ placa });

  if (loading) {
    return <CircularProgress size={16} />;
  }

  if (error) {
    return <Typography color="error" variant="caption">Error</Typography>;
  }

  if (assignedDates.length === 0) {
    return <Typography variant="caption">Disponible</Typography>;
  }

  return (
    <List dense>
      {assignedDates.map((date, index) => (
        <ListItem key={index} disableGutters>
          <ListItemText
            primary={`Del ${new Date(date.fecha_salida).toLocaleDateString()} al ${new Date(date.fecha_regreso).toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default function VehiculosTable({ data, onEdit, onDelete }) {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año Fabricacion</TableCell>
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
                  <TableCell>{row.año_fabricacion}</TableCell>
                  <TableCell>{row.capacidad_maxima}</TableCell>
                  <TableCell>{getTipoVehiculoNombre(row.id_tipo_vehiculo)}</TableCell>
                  <TableCell>
                    <FechasAsignadas placa={row.placa} />
                  </TableCell>
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
