"use strict";

import { AppDataSource } from "../config/configDb.js";
import Registro from "../entity/registro.entity.js";

// Servicio para crear un registro
export async function createRegistroService(registroData) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    
    const registro = registroRepository.create(registroData);
    await registroRepository.save(registro);

    return [registro, null];
  } catch (error) {
    console.error("Error al crear el registro:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todos los registros
export async function getAllRegistrosService() {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registros = await registroRepository.find();

    return [registros, null];
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener un registro por ID
export async function getRegistroService(id_registro) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOneBy({ id_registro });

    if (!registro) {
      return [null, "Registro no encontrado"];
    }

    return [registro, null];
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar un registro
export async function updateRegistroService(id_registro, registroData) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOneBy({ id_registro });

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

// Servicio para eliminar un registro
export async function deleteRegistroService(id_registro) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOneBy({ id_registro });

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
