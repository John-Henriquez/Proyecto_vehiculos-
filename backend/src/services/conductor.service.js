"use strict";
import { AppDataSource } from "../config/configDb.js";
import Conductor from "../entity/conductor.entity.js";

export async function getConductoresService(rut_conductor) {
  try {
    console.log("getConductoresService - Buscando conductor con RUT:", rut_conductor);
    const conductorRepository = AppDataSource.getRepository(Conductor);
    const conductor = await conductorRepository.findOne({
      where: { rut_conductor },
    });
    
    if (!conductor) {
      throw new Error("getConductoresService - Conductor no encontrado");
    }
    
    return conductor;
  }catch (error) {
    console.error("Error en getConductoresService:", error);
    throw new Error(error.message || "Error al obtener conductores");
  }
}

export async function getAllConductoresService() {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);
    return await conductorRepository.find();
  } catch (error) {
    throw new Error(error.message || "Error al obtener conductores");
  }
}

export async function isConductorAvailableService(rut_conductor) {
  try {
    console.log("isConductorAvailableService - Verificando disponibilidad del conductor con RUT:", rut_conductor);
    const conductorRepository = AppDataSource.getRepository(Conductor);
    const conductor = await getConductoresService(rut_conductor);

    if (!conductor) {
      throw new Error("isConductorAvailableService - Conductor no encontrado");
    }

    if (conductor.estado !== "disponible") {
      throw new Error("isConductorAvailableService - Conductor no disponible");
    }

    return conductor;
  } catch (error) {
    throw new Error(error.message || "Error al verificar disponibilidad del conductor");
  }
}

export async function assignConductorService(rut_conductor) {
  try {
    console.log("Verificando disponibilidad del conductor con RUT:", rut_conductor);
    await isConductorAvailableService(rut_conductor);

    const conductor = await getConductoresService(rut_conductor);
    console.log("Conductor obtenido:", conductor);

    if (!conductor) {
      throw new Error("Conductor no encontrado");
    }

    conductor.estado = "asignado";
    await AppDataSource.getRepository(Conductor).save(conductor);

    return conductor; 
  } catch (error) {
    console.error("Error en assignConductorService:", error);
    throw new Error(error.message || "Error al asignar conductor");
  }
}


export async function releaseConductorService(rut_conductor) {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const conductor = await getConductoresService(rut_conductor);
    conductor.estado = "disponible";

    await conductorRepository.save(conductor);
    return conductor
  } catch (error) {
    throw new Error(error.message || "Error al liberar conductor");
  }
}

export async function createConductorService(data) {
  try {
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const existingConductor = await conductorRepository.findOne({
      where: { rut_conductor: data.rut_conductor },
    });

    if(existingConductor) {
      throw new Error("Conductor ya existe");
    }

    const newConductor = conductorRepository.create(data);
    await conductorRepository.save(newConductor);

    return newConductor;
  }catch (error) {
    throw new Error(error.message || "Error al crear conductor");
  }
}

export async function updateConductorService(rut_conductor, data){
  try{
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const conductor = await getConductoresService(rut_conductor);
    Object.assign(conductor, data);
    
    await conductorRepository.save(conductor);
  }catch (error) {
    throw new Error(error.message || "Error al actualizar conductor");
  }
}

export async function deleteConductorService(rut_conductor){
  try{
    const conductorRepository = AppDataSource.getRepository(Conductor);

    const conductor = await getConductoresService(rut_conductor);
    await conductorRepository.remove(conductor);
    
  }catch(error){
    throw new Error(error.message || "Error al eliminar conductor");
  }
}