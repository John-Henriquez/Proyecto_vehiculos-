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
  Pagination,
  CircularProgress,
  Typography,
  List, 
  ListItem, 
  ListItemText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAssignedDates from "../hooks/assignments/useAssignedDates";

const FechasAsignadas = ({ rut_conductor }) => {
  const { assignedDates, loading, error } = useAssignedDates({ rut_conductor });

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

export default function ConductoresTable({ data, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.slice(startIndex, endIndex) || [];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RUT</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Fechas Asignadas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <TableRow key={row.rut_conductor}>
                  <TableCell>{row.rut_conductor}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.telefono}</TableCell>
                  <TableCell>
                    <FechasAsignadas rut_conductor={row.rut_conductor} />
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
                <TableCell colSpan={5} align="center">
                  No hay conductores disponibles
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