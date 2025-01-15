"use strict";

import {
  createSolicitudService,
  getAllSolicitudesService,
  getSolicitudService,
  updateSolicitudService,
  deleteSolicitudService,
} from "../services/solicitud.service.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";


export async function getSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;

    const solicitud = await getSolicitudService(id_solicitud);
    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }
    return handleSuccess(res, 200, "Solicitud encontrada", solicitud);
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getAllSolicitudes(req, res) {
  try {
    const solicitudes = await getAllSolicitudesService();
    if (!solicitudes || solicitudes.length === 0) {
      return handleErrorClient(res, 404, "No hay solicitudes registradas"); 
    }
    return handleSuccess(res, 200, "Solicitudes encontradas", solicitudes);
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function createSolicitud(req, res) {
  try {
    const { rut_solicitante, placa_patente, fecha_solicitud, estado, prioridad } = req.body;

    if (!rut_solicitante || !placa_patente || !fecha_solicitud || !estado || !prioridad) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios"); 
    }

    const solicitud = await createSolicitudService(req.body);
    if (error) {
      return handleErrorClient(res, 400, `Error al crear la solicitud: ${error}`);
    }
    return handleSuccess(res, 201, "Solicitud creada exitosamente", solicitud);
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function updateSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    const { estado, observaciones } = req.body;
    if (!estado && !observaciones) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios");
    }

    const solicitud = await updateSolicitudService(id_solicitud, req.body);
    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    return handleSuccess(res, 200, "Solicitud actualizada exitosamente", solicitud);
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function deleteSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;

    const solicitudEliminada = await deleteSolicitudService(id_solicitud);
    if (!solicitudEliminada) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    return handleSuccess(res, 200, "Solicitud eliminada exitosamente", solicitudEliminada);
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
