"use strict";

import { AppDataSource } from "../config/configDb.js";
import Registro from "../entity/registro.entity.js";

export async function createRegistroService(solicitud) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);

    const registroData = {
      id_solicitud: solicitud.id_solicitud,
      nombre_agrupacion: solicitud.nombre_agrupacion,
      num_telefono: solicitud.numero_telefono,
      fecha_solicitud: solicitud.fecha_creacion,
      fecha_salida: solicitud.fecha_salida,
      fecha_regreso: solicitud.fecha_regreso || null,  
      destino: solicitud.destino,
      prioridad: solicitud.prioridad,
      estado: solicitud.estado,  
      observaciones: solicitud.observaciones || null,  
      placa_vehiculo: solicitud.placa_vehiculo || null,  
      rut_conductor: solicitud.rut_conductor || null,
      fecha_cambio_estado: new Date(),
    };

    const registro = registroRepository.create(registroData);
    await registroRepository.save(registro);

    return [registro, null]; 
  } catch (error) {
    console.error("Error al crear el registro:", error);
    return [null, error.message || "Error interno del servidor"];
  }
}

export async function getAllRegistrosService() {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registros = await registroRepository.find({
      relations: ["vehiculo", "solicitud"], // Incluye relaciones
    });

    return [registros, null];
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRegistroService(id_registro) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOne({ 
      where: { id_registro },
      relations: ["vehiculo", "solicitud"],  // Incluye relaciones
    });

    if (!registro) {
      return [null, "Registro no encontrado"];
    }

    return [registro, null];
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateRegistroService(id_registro, registroData) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOne({ 
      where: { id_registro },
    });

    if (!registro) {
      return [null, "Registro no encontrado"];
    }

    registroRepository.merge(registro, registroData);
    await registroRepository.save(registro);

    return [registro, null];
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteRegistroService(id_registro) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOne({
      where: { id_registro }
    });

    if (!registro) {
      return [null, "Registro no encontrado"];
    }

    await registroRepository.remove(registro);

    return [registro, null];
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return [null, "Error interno del servidor"];
  }
}
