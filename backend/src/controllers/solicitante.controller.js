"use strict";

import {
  createSolicitanteService,
  getAllSolicitantesService,
  getSolicitanteService,
  updateSolicitanteService,
  deleteSolicitanteService,
} from "../services/SolicitanteService.js";

export async function getSolicitante(req, res) {
  try {
    const { rut } = req.params;
    const [solicitante, error] = await getSolicitanteService(rut);
    if (error) {
      return res.status(404).json({ error: "Solicitante no encontrado" });
    }
    return res.json(solicitante);
  } catch (error) {
    console.error("Error al obtener el solicitante:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllSolicitantes(req, res) {
  try {
    const [solicitantes, error] = await getAllSolicitantesService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron solicitantes" });
    }
    return res.json(solicitantes);
  } catch (error) {
    console.error("Error al obtener los solicitantes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createSolicitante(req, res) {
  try {
    const { rut, nombre, tipo_solicitante } = req.body;
    if (!rut || !nombre || !tipo_solicitante) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [solicitante, error] = await createSolicitanteService(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(201).json(solicitante);
  } catch (error) {
    console.error("Error al crear el solicitante:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateSolicitante(req, res) {
  try {
    const { rut } = req.params;
    const { nombre, direccion, telefono } = req.body;
    if (!nombre && !direccion && !telefono) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [solicitante, error] = await updateSolicitanteService(rut, req.body);
    if (error) {
      return res.status(404).json({ error: "Solicitante no encontrado" });
    }

    return res.json(solicitante);
  } catch (error) {
    console.error("Error al actualizar el solicitante:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteSolicitante(req, res) {
  try {
    const { rut } = req.params;
    const [solicitante, error] = await deleteSolicitanteService(rut);

    if (error) {
      return res.status(404).json({ error: "Solicitante no encontrado" });
    }

    return res.json({ message: "Solicitante eliminado exitosamente", solicitante });
  } catch (error) {
    console.error("Error al eliminar el solicitante:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
