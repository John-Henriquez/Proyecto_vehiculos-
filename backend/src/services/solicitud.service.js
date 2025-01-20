"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Solicitud  from "../entity/solicitud.entity.js";
import Registro from "../entity/registro.entity.js";
import Conductor from "../entity/conductor.entity.js";
import { assignConductorService, isConductorAvailableService, releaseConductorService } from "./conductor.service.js";

export async function createSolicitudService(solicitudData) {
  console.log("Solicitud Data:", solicitudData);
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    console.log("Asignando conductor con RUT:", solicitudData.rut_conductor);

    const conductor = await assignConductorService(solicitudData.rut_conductor);
    console.log("Conductor asignado:", conductor);

    if (!conductor) {
      throw new Error("Conductor no asignado");
    }
    
  
    const solicitud = solicitudRepository.create(solicitudData);
    solicitud.rut_conductor = conductor.rut_conductor;

    await solicitudRepository.save(solicitud);

    const currentData = new Date();
    if (solicitud.fecha_regreso && new Date(solicitud.fecha_regreso) < currentData) {
      await releaseConductorService(solicitud.rut_conductor);
    }

    return solicitud; 
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function updateSolicitudService(id_solicitud, solicitudData) {

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro);
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (!solicitudData.rut_solicitante || !solicitudData.placa_patente 
      || !solicitudData.estado || !solicitudData.prioridad) {
      throw new Error("Campos necesarios faltan para procesar la solicitud");
    }
    
    solicitudRepository.merge(solicitud, solicitudData);
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
    }

    const currentData = new Date();
    if (solicitud.fecha_regreso && new Date(solicitud.fecha_regreso) < currentData) {
      await releaseConductorService(solicitud.rut_conductor);
    }
    return solicitud
  } catch (error) {
    throw new Error(error.message || "Error al actualizar la solicitud");
  }
}

export async function getAllSolicitudesService(user) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    let solicitudes;

    if (user.rol === "administrador") {
      solicitudes = await solicitudRepository.find();
    } else if (user.rol === "usuario") {
      solicitudes = await solicitudRepository.find({ where: { rut_solicitante: user.rut } });
    } else {
      throw new Error("No tienes permiso para acceder a este recurso");
    }

    return solicitudes;
  } catch (error) {
    throw new Error(error.message || "Error al obtener las solicitudes");
  }
}

export async function getSolicitudService(id_solicitud, user) {

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    let solicitud;
    if (user.rol === "administrador") {
      solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });
    } else if (user.rol === "usuario") {
      solicitud = await solicitudRepository.findOne({ where: { id_solicitud, rut_solicitante: user.rut } });
    } else {
      throw new Error("No tienes permiso para acceder a este recurso");
    }
    
    return solicitud
  } catch (error) {
    throw new Error(error.message || "Error al obtener la solicitud");
  }
}

export async function deleteSolicitudService(id_solicitud, user) {
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
      return "Solicitud eliminada";
    }

    if (solicitud.rut_solicitante !== user.rut) {
      throw new Error("No tienes permiso para eliminar esta solicitud");
    }

    await solicitudRepository.remove(solicitud);
    return "Solicitud eliminada";
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la solicitud");
  }
}
