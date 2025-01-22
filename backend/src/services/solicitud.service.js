"use strict";

import { AppDataSource } from "../config/configDb.js";
import Registro from "../entity/registro.entity.js";
import Solicitud from "../entity/solicitud.entity.js";

export async function createSolicitudService(solicitudData, user) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    if (!solicitudData.rut_solicitante || !solicitudData.nombre_agrupacion || !solicitudData.numero_telefono || !solicitudData.estado || !solicitudData.prioridad || !solicitudData.id_tipo_vehiculo) {
      throw new Error("Faltan datos obligatorios");
    }

    const solicitud = solicitudRepository.create({
      ...solicitudData,
      rut_creador: user.rut,
      fecha_creacion: new Date(),
      rut_conductor: solicitudData.rut_conductor || null,
      placa_patente: solicitudData.placa_patente || null,
    });

    console.log("solicitudService - Creando solicitud:", solicitud);
    await solicitudRepository.save(solicitud);

    console.log("solicitudService - Solicitud creada con éxito:");
    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function updateSolicitudService(id_solicitud, solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro);

    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    console.log("solicitudService - Solicitud encontrada:", solicitud);
    const estadoAnterior = solicitud.estado;

    Object.keys(solicitudData).forEach((key) => {
      if (solicitudData[key] !== undefined) {
        solicitud[key] = solicitudData[key];
      }
    });

    console.log("solicitudService - Solicitud actualizada con éxito:", solicitud);
    console.log("solicitudService - Estado anterior:", estadoAnterior);
    console.log("solicitudSerice - Estado actualizado:", solicitud.estado);
    await solicitudRepository.save(solicitud);


    if ((estadoAnterior !== solicitud.estado) && (solicitud.estado === "aceptada" || solicitud.estado === "rechazada")) {
      
      const registro = registroRepository.create({
        id_solicitud: solicitud.id_solicitud,
        nombre_agrupacion: solicitud.nombre_agrupacion,
        num_telefono: solicitud.numero_telefono,
        fecha_solicitud: solicitud.fecha_creacion,
        fecha_salida: solicitud.fecha_salida,
        fecha_regreso: solicitud.estado === "aceptada" ? solicitud.fecha_regreso : null, 
        destino: solicitud.destino,
        prioridad: solicitud.prioridad,
        estado: solicitud.estado,
        observaciones: solicitud.estado === "rechazada" ? solicitud.observaciones : null, 
        placa_vehiculo: solicitud.placa_patente || null,  
        rut_conductor: solicitud.rut_conductor || null,  
      });

      console.log("solicitudService - Registro creado para solicitud:", registro);
      await registroRepository.save(registro);
    }

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
    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (user.rol !== "administrador" && solicitud.rut_solicitante !== user.rut) {
      throw new Error("No tienes permiso para eliminar esta solicitud");
    }

    await solicitudRepository.remove(solicitud);
    console.log("solicitudService - Solicitud eliminada");
    return "Solicitud eliminada";
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la solicitud");
  }
}
