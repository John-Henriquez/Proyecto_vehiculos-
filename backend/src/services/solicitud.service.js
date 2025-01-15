"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Solicitud  from "../entity/solicitud.entity.js";
import Registro from "../entity/registro.entity.js";

export async function updateSolicitudService(id_solicitud, solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro); 

    const solicitud = await solicitudRepository.findOne(
      { where: { id_solicitud }
    });

    if (!solicitud) {
      return [null, "Solicitud no encontrada"];
    }

    const estadoAnterior = solicitud.estado;
    const estadoNuevo = solicitudData.estado;

    solicitudRepository.merge(solicitud, solicitudData);
    await solicitudRepository.save(solicitud);

    if (estadoAnterior !== estadoNuevo) {
      const registroData = {
        id_solicitud: solicitud.id_solicitud,
        rut_solicitante: solicitud.rut_usuario,
        placa_vehiculo: solicitud.placa_vehiculo,
        fecha_solicitud: solicitud.fecha_solicitud,
        motivo: solicitud.motivo,
        estado: estadoNuevo,
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
    return [null, "Error interno del servidor"];
  }
}
export async function createSolicitudService(solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    
    const solicitud = solicitudRepository.create(solicitudData);
    await solicitudRepository.save(solicitud);

    return [solicitud, null];
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllSolicitudesService() {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitudes = await solicitudRepository.find();

    return [solicitudes, null];
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({ 
      where: { id_solicitud } 
    });

    if (!solicitud) {
      return [null, "Solicitud no encontrada"];
    }

    return [solicitud, null];
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}


// Servicio para eliminar una solicitud
export async function deleteSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      return [null, "Solicitud no encontrada"];
    }

    await solicitudRepository.remove(solicitud);

    return [solicitud, null];
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}
