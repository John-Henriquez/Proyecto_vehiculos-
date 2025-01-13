"use strict";

import {
  createVehiculoService,
  getAllVehiculosService,
  getVehiculoService,
  updateVehiculoService,
  deleteVehiculoService,
} from "../services/vehiculo.service.js";

export async function getVehiculo(req, res) {
  try {
    const { placa } = req.params;
    const [vehiculo, error] = await getVehiculoService(placa);
    if (error) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    return res.json(vehiculo);
  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllVehiculos(req, res) {
  try {
    const [vehiculos, error] = await getAllVehiculosService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron vehículos" });
    }
    return res.json(vehiculos);
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createVehiculo(req, res) {
  try {
    const { placa, tipo_vehiculo, marca, modelo, anio_fabricacion } = req.body;
    if (!placa || !tipo_vehiculo || !marca || !modelo || !anio_fabricacion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [vehiculo, error] = await createVehiculoService(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(201).json(vehiculo);
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateVehiculo(req, res) {
  try {
    const { placa } = req.params;
    const { tipo_vehiculo, marca, modelo, anio_fabricacion } = req.body;
    if (!tipo_vehiculo && !marca && !modelo && !anio_fabricacion) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [vehiculo, error] = await updateVehiculoService(placa, req.body);
    if (error) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    return res.json(vehiculo);
  } catch (error) {
    console.error("Error al actualizar el vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteVehiculo(req, res) {
  try {
    const { placa } = req.params;
    const [vehiculo, error] = await deleteVehiculoService(placa);

    if (error) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    return res.json({ message: "Vehículo eliminado exitosamente", vehiculo });
  } catch (error) {
    console.error("Error al eliminar el vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
