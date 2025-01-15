"use strict";
import { AppDataSource } from "../config/configDb.js";
import Conductor from "../entity/conductor.entity.js";




export async function getConductoresService(rut_conductor) {
    try {
      const conductorRepository = AppDataSource.getRepository(Conductor);
      const conductores = await conductorRepository.findOne({
        where: { rut_conductor },
      });
  
      if (!conductores) {
        throw new Error("Conductor no encontrado");
      }

      return [conductores, null];
    }catch (error) {
      throw new Error(error.message || "Error al obtener conductores");
    }
}

export async function isConductorAvailableService(rut_conductor) {
  try {

    const conductor = await getConductoresService(rut_conductor);

    if (conductor.estado !== "disponible") {
      throw new Error("Conductor no disponible");
    }

    return true;
  } catch (error) {
    throw new Error(error.message || "Error al verificar disponibilidad del conductor");
  }
}

export async function assignConductorService(rut_conductor) {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const conductor = await getConductoresService(rut_conductor);

    if (conductor.estado !== "disponible") {
      throw new Error("Conductor no disponible");
    }

    conductor.estado = "ocupado";
    await conductorRepository.save(conductor);

    return conductor;
  } catch (error) {
    throw new Error(error.message || "Error al asignar conductor");
  }
}

export async function releaseConductorService(rut_conductor) {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);

    conductor.estado = "disponible";
    await conductorRepository.save(conductor);

    return conductor
  } catch (error) {
    throw new Error(error.message || "Error al liberar conductor");
  }
}

export async function getAllConductoresService() {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);
    const conductores = await conductorRepository.find();

    return conductores;
  } catch (error) {
    throw new Error(error.message || "Error al obtener conductores");
  }
}
