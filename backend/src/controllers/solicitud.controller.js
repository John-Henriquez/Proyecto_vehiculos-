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
    const solicitud = await getSolicitudService(id_solicitud, req.user);
    
    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    if (solicitud.rut_solicitante !== req.user.rut && req.user.rol !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permiso para ver esta solicitud");
    }

    return handleSuccess(res, 200, "Solicitud encontrada", solicitud);
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getAllSolicitudes(req, res) {
  try {
    let solicitudes;

    if (req.user.rol === "administrador") {
      solicitudes = await getAllSolicitudesService(req.user);
    } else {
      solicitudes = await getAllSolicitudesService(req.user);
    }

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
    const {       
      placa_patente, 
      fecha_solicitud, 
      prioridad, 
      nombre_agrupacion, 
      num_telefono, 
      fecha_salida, 
      destino, 
      observaciones 
    } = req.body;

    if (!placa_patente || !fecha_solicitud || !prioridad) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios"); 
    }

    const rut_solicitante = req.user.rut;
    
    const solicitudData = {
      rut_solicitante,
      placa_patente,
      fecha_solicitud,
      prioridad,
      nombre_agrupacion,
      num_telefono,
      fecha_salida,
      destino,
      observaciones
    };

    const solicitud = await createSolicitudService(solicitudData);
  
    return handleSuccess(res, 201, "Solicitud creada exitosamente", solicitud);
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function updateSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    const { rut_solicitante, placa_patente, estado, prioridad, observaciones } = req.body;

    if (!rut_solicitante || !placa_patente || !estado || !prioridad) {
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
    const solicitud = await getSolicitudService(id_solicitud);

    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    if(solicitud.rut_solicitante !== req.user.rut && req.user.rol !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permiso para eliminar esta solicitud");
    }
  
    const solicitudEliminada = await deleteSolicitudService(id_solicitud, req.user);

    return handleSuccess(res, 200, "Solicitud eliminada exitosamente", solicitudEliminada);
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
