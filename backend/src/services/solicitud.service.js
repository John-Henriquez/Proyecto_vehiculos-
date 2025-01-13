"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Solicitud } from "../entity/Solicitud.js";

// Servicio para crear una solicitud
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

// Servicio para obtener todas las solicitudes
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

// Servicio para obtener una solicitud por ID
export async function getSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOneBy({ id_solicitud });

    if (!solicitud) {
      return [null, "Solicitud no encontrada"];
    }

    return [solicitud, null];
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar una solicitud
export async function updateSolicitudService(id_solicitud, solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOneBy({ id_solicitud });

    if (!solicitud) {
      return [null, "Solicitud no encontrada"];
    }

    solicitudRepository.merge(solicitud, solicitudData);
    await solicitudRepository.save(solicitud);

    return [solicitud, null];
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar una solicitud
export async function deleteSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOneBy({ id_solicitud });

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
