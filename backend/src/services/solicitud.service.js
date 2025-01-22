"use strict";

import { AppDataSource } from "../config/configDb.js";
import Solicitud from "../entity/solicitud.entity.js";
import Registro from "../entity/registro.entity.js";
import Conductor from "../entity/conductor.entity.js";
import { assignConductorService, releaseConductorService } from "./conductor.service.js";

export async function createSolicitudService(solicitudData, user) {
  console.log("solicitudService - Solicitud Data:", solicitudData);
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    if (!solicitudData.rut_solicitante) {
      throw new Error("Rut solicitante es requerido");
    }

    const solicitud = solicitudRepository.create({
      ...solicitudData,
      rut_creador: user.rut,  
      rut_conductor: solicitudData.rut_conductor || null,
      placa_patente: solicitudData.placa_patente || null,
    });

    console.log("solicitudService - Creando solicitud:", solicitud);

    await solicitudRepository.save(solicitud);

    const currentData = new Date();
    if (solicitud.fecha_regreso && new Date(solicitud.fecha_regreso) < currentData) {
      await releaseConductorService(solicitud.rut_conductor);
    }

    console.log("solicitudService - Solicitud creada con éxito:", solicitud);
    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function updateSolicitudService(id_solicitud, solicitudData) {

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro);

    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    console.log("solicitudService - Solicitud encontrada:", solicitud);

    Object.keys(solicitudData).forEach((key) => {
      if(solicitudData[key] !== undefined){
        solicitud[key] = solicitudData[key];
      }
    });

    await solicitudRepository.save(solicitud);

    if (["aprobada", "rechazada"].includes(solicitudData.estado)) {
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

      console.log("solicitudService - Registro creado:", registro);

      await solicitudRepository.remove(solicitud);
    }

    const currentData = new Date();
    if (solicitud.fecha_regreso && new Date(solicitud.fecha_regreso) < currentData) {
      await releaseConductorService(solicitud.rut_conductor);
    }

    console.log("solicitudService - Solicitud actualizada con éxito:", solicitud);
    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al actualizar la solicitud");
  }
}

export async function getAllSolicitudesService() {
  console.log("solicitudService - Obtener todas las solicitudes");
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitudes = await solicitudRepository.find();
    console.log("solicitudService - Solicitudes obtenidas:", solicitudes);
    return solicitudes;
  } catch (error) {
    throw new Error(error.message || "Error al obtener las solicitudes");
  }
}



export async function getSolicitudService(id_solicitud) {
  console.log("solicitudService - Obtener solicitud con id:", id_solicitud);
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);


    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    console.log("solicitudService - Solicitud encontrada:", solicitud);
    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al obtener la solicitud");
  }
}


export async function deleteSolicitudService(id_solicitud, user) {
  console.log("solicitudService - Eliminar solicitud con id:", id_solicitud, "para el usuario:", user);
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if(user.rol === "administrador") {
      await solicitudRepository.remove(solicitud);
      console.log("solicitudService - Solicitud eliminada");
      return "Solicitud eliminada";
    }

    if (solicitud.rut_solicitante !== user.rut) {
      throw new Error("No tienes permiso para eliminar esta solicitud");
    }

    await solicitudRepository.remove(solicitud);
    console.log("solicitudService - Solicitud eliminada");
    return "Solicitud eliminada";
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la solicitud");
  }
}
