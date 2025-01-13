"use strict";

import { getAllRegistrosService, getRegistroService } from "../services/RegistroService.js";

// Controlador para obtener todos los registros
export async function getAllRegistros(req, res) {
  try {
    const [registros, error] = await getAllRegistrosService();

    if (error) {
      return res.status(404).json({ error: "No se encontraron registros" });
    }

    return res.json(registros);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Controlador para obtener un registro por ID
export async function getRegistroById(req, res) {
  try {
    const { id_registro } = req.params;
    const [registro, error] = await getRegistroService(id_registro);

    if (error) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    return res.json(registro);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Controlador para obtener registros por placa de vehículo
export async function getRegistrosByVehiculo(req, res) {
  try {
    const { placa } = req.params;
    const [registros, error] = await getAllRegistrosService();

    // Filtrar los registros por placa de vehículo
    const registrosFiltrados = registros.filter(registro => registro.placa_vehiculo === placa);

    if (registrosFiltrados.length === 0) {
      return res.status(404).json({ error: "No se encontraron registros para este vehículo" });
    }

    return res.json(registrosFiltrados);
  } catch (error) {
    console.error("Error al obtener los registros del vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
