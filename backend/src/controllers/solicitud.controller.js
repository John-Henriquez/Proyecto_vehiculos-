"use strict";

import {
  createSolicitudService,
  getAllSolicitudesService,
  getSolicitudService,
  updateSolicitudService,
  deleteSolicitudService,
} from "../services/SolicitudService.js";

export async function getSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    const [solicitud, error] = await getSolicitudService(id_solicitud);
    if (error) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    return res.json(solicitud);
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllSolicitudes(req, res) {
  try {
    const [solicitudes, error] = await getAllSolicitudesService();
    if (error) {
      return res.status(404).json({ error: "No se encontraron solicitudes" });
    }
    return res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createSolicitud(req, res) {
  try {
    const { rut_solicitante, placa_vehiculo, fecha_solicitud } = req.body;
    if (!rut_solicitante || !placa_vehiculo || !fecha_solicitud) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [solicitud, error] = await createSolicitudService(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(201).json(solicitud);
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    const { estado, observaciones } = req.body;
    if (!estado && !observaciones) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const [solicitud, error] = await updateSolicitudService(id_solicitud, req.body);
    if (error) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    return res.json(solicitud);
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    const [solicitud, error] = await deleteSolicitudService(id_solicitud);

    if (error) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    return res.json({ message: "Solicitud eliminada exitosamente", solicitud });
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
