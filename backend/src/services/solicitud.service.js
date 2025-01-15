"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Solicitud  from "../entity/solicitud.entity.js";
import Registro from "../entity/registro.entity.js";
import User from "../entity/user.entity.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function updateSolicitudService(req, res) {
  const { id_solicitud } = req.params;
  const solicitudData = req.body;

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro);

    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitudData.rut_solicitante || !solicitudData.placa_patente || !solicitudData.estado || !solicitudData.prioridad) {
      return handleErrorClient(res, 400, "Campos necesarios faltan para procesar la solicitud");
    }
    
    
    solicitudRepository.merge(solicitud, solicitudData);
    await solicitudRepository.save(solicitud);

    if (solicitudData.estado === "aceptado" || solicitudData.estado === "rechazado") {
      const registroData = {
        id_solicitud: solicitud.id_solicitud,
        placa_vehiculo: solicitud.placa_patente,
        fecha_solicitud: solicitud.fecha_solicitud,
        estado: solicitudData.estado,
        observaciones: solicitudData.observaciones || solicitud.observaciones,
        prioridad: solicitud.prioridad,
        fecha_cambio_estado: new Date(),
      };


      const registro = registroRepository.create(registroData);
      await registroRepository.save(registro);
    }

    return [solicitud, null];
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return handleErrorServer(res,500, "Error interno del servidor");
  }
}

export async function createSolicitudService(solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { rut: solicitudData.rut_solicitante } });

    if (!user) {
      throw new Error("El usuario con el rut proporcionado no existe");
    }

    const solicitud = solicitudRepository.create({
      ...solicitudData,
      rut_solicitante: user.rut,
    });

    await solicitudRepository.save(solicitud);

    return [solicitud, null]; 
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return [null, error.message]; 
  }
}

export async function getAllSolicitudesService(req, res) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitudes = await solicitudRepository.find();

    return handleSuccess(res, 200, "Solicitudes obtenidas correctamente");
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getSolicitudService(req, res) {
  const { id_solicitud } = req.params;

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({ 
      where: { id_solicitud } 
    });

    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    return handleSuccess(res, 200, "Solicitud obtenida correctamente", solicitud);
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function deleteSolicitudService(req, res) {
  const { id_solicitud } = req.params;

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    await solicitudRepository.remove(solicitud);

    return handleSuccess(res, 200, "solicitud eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
