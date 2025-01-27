"use strict";

import {
  createSolicitudService,
  deleteSolicitudService,
  getAllSolicitudesService,
  getSolicitudService,
  updateSolicitudService,
} from "../services/solicitud.service.js";
import { sendEmail } from "../services/email.service.js";
import { getUserService } from "../services/user.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    console.log("solicitudController - Obtener solicitud con id:", id_solicitud);

    const solicitud = await getSolicitudService(id_solicitud);

    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    if (solicitud.rut_solicitante !== req.user.rut && req.user.rol !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permiso para ver esta solicitud");
    }

    return handleSuccess(res, 200, "Solicitud encontrada", solicitud);
  } catch (error) {
    console.error("solicitudController - Error al obtener la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getAllSolicitudes(req, res) {
  try {
    const solicitudes = await getAllSolicitudesService();

    if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
      return handleErrorClient(res, 404, "No hay solicitudes registradas");
    }

    return handleSuccess(res, 200, "Solicitudes encontradas", solicitudes);
  } catch (error) {
    console.error("solicitudController - Error al obtener las solicitudes:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function createSolicitud(req, res) {
  try {
    const {
      rut_solicitante,
      nombre_agrupacion,
      numero_telefono,
      fecha_salida,
      destino,
      placa_patente,
      estado,
      observaciones,
      rut_conductor,
      prioridad,
      fecha_regreso,
      cantidad_pasajeros,
      id_tipo_vehiculo,
    } = req.body;

    if (!rut_solicitante || !nombre_agrupacion || !numero_telefono || !estado || !prioridad || !id_tipo_vehiculo) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios en la solicitud");
    }

    const solicitudData = {
      rut_solicitante,
      nombre_agrupacion,
      numero_telefono,
      fecha_salida,
      destino,
      placa_patente: placa_patente || null,
      estado,
      observaciones: observaciones || null,
      rut_conductor: rut_conductor || null, 
      prioridad,
      fecha_regreso: fecha_regreso || null,
      cantidad_pasajeros: cantidad_pasajeros || null,
      id_tipo_vehiculo,
    };

    console.log("solicitudController - Crear solicitud con los datos:", solicitudData);
    const solicitud = await createSolicitudService(solicitudData, req.user);

    return handleSuccess(res, 201, "Solicitud creada exitosamente", solicitud);
  } catch (error) {
    console.error("solicitudController - Error al crear la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function updateSolicitud(req, res) {
  try {
    console.log("Datos del usuario autenticado:", req.user);
    const { id_solicitud } = req.params;
    const { estado, observaciones } = req.body;

    console.log("solicitudController - Id solicitud a actualizar:", id_solicitud);
    
    const solicitud = await updateSolicitudService(id_solicitud, req.body, req.user);
    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    const { rut_creador } = solicitud;

    const [usuarioCreador, error] = await getUserService({ rut: rut_creador });
    if (error) {
      return handleErrorClient(res, 404, "Creador de la solicitud no encontrado");
    }

    const emailUsuario = usuarioCreador.email;

    console.log("correo del usuario:", emailUsuario);

    if (estado === "aprobada" || estado === "rechazada") {
      if (estado === "aprobada") {
        await sendEmail(
          emailUsuario,
          "Tu solicitud ha sido aceptada",
          `Tu solicitud ha sido aceptada.\nDetalles: ${observaciones || "Ninguna"}`
        );
      }else if (estado === "rechazada") {
        await sendEmail(
          emailUsuario,
          "Tu solicitud ha sido rechazada",
          `Tu solicitud ha sido rechazada.\nDetalles: ${observaciones || "Ninguna"}`
        );
      }
    }

    return handleSuccess(res, 200, "Solicitud actualizada exitosamente", solicitud);
  } catch (error) {
    console.error("solicitudController - Error al actualizar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function deleteSolicitud(req, res) {
  try {
    const { id_solicitud } = req.params;
    console.log("solicitudController - Id solicitud a eliminar:", id_solicitud);

    const solicitudEliminada = await deleteSolicitudService(id_solicitud, req.user);

    return handleSuccess(res, 200, "Solicitud eliminada exitosamente", solicitudEliminada);
  } catch (error) {
    console.error("solicitudController - Error al eliminar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
