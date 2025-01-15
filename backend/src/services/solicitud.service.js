"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Solicitud  from "../entity/solicitud.entity.js";
import Registro from "../entity/registro.entity.js";
import User from "../entity/user.entity.js";

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

    if (!solicitudData.rut_solicitante || !solicitudData.placa_patente || !solicitudData.estado || !solicitudData.prioridad) {
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

    return solicitud
  } catch (error) {
    throw new Error(error.message || "Error al actualizar la solicitud");
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

    return solicitud; 
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function getAllSolicitudesService() {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitudes = await solicitudRepository.find();

    return solicitudes;
  } catch (error) {
    throw new Error(error.message || "Error al obtener las solicitudes");
  }
}

export async function getSolicitudService(id_solicitud) {

  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({ 
      where: { id_solicitud } 
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }
    return solicitud
  } catch (error) {
    throw new Error(error.message || "Error al obtener la solicitud");
  }
}

export async function deleteSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitud = await solicitudRepository.findOne({
      where: { id_solicitud }
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    await solicitudRepository.remove(solicitud);

    return "Solicitud eliminada";
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la solicitud");
  }
}
