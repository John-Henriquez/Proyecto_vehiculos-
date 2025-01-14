"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Solicitante  from "../entity/solicitante.entity.js";

export async function createSolicitanteService(solicitanteData) {
  try {
    const solicitanteRepository = AppDataSource.getRepository(Solicitante);
    
    const solicitante = solicitanteRepository.create(solicitanteData);
    await solicitanteRepository.save(solicitante);

    return [solicitante, null];
  } catch (error) {
    console.error("Error al crear el solicitante:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllSolicitantesService() {
  try {
    const solicitanteRepository = AppDataSource.getRepository(Solicitante);
    const solicitantes = await solicitanteRepository.find();

    return [solicitantes, null];
  } catch (error) {
    console.error("Error al obtener los solicitantes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getSolicitanteService(rut) {
  try {

    if (!rut) {
      return [null, "RUT no proporcionado"];
    }
    const solicitanteRepository = AppDataSource.getRepository(Solicitante); 
    const solicitante = await solicitanteRepository.findOne({
      where: { rut }
    });

    if (!solicitante) {
      console.log("No se encontró solicitante con el RUT:", rut);
      return [null, "Solicitante no encontrado"];
    }

    return [solicitante, null];
  } catch (error) {
    console.error("Error al obtener el solicitante:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function updateSolicitanteService(rut, solicitanteData) {
  try {
    const solicitanteRepository = AppDataSource.getRepository(Solicitante);
    const solicitante = await solicitanteRepository.findOne({ 
      where: { rut },
  });

    if (!solicitante) {
      return [null, "Solicitante no encontrado"];
    }

    solicitanteRepository.merge(solicitante, solicitanteData);
    await solicitanteRepository.save(solicitante);

    return [solicitante, null];
  } catch (error) {
    console.error("Error al actualizar el solicitante:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteSolicitanteService(rut) {
  try {
    const solicitanteRepository = AppDataSource.getRepository(Solicitante);
    const solicitante = await solicitanteRepository.findOne({ 
      where: { rut }
  });

    if (!solicitante) {
      return [null, "Solicitante no encontrado"];
    }

    await solicitanteRepository.remove(solicitante);

    return [solicitante, null];
  } catch (error) {
    console.error("Error al eliminar el solicitante:", error);
    return [null, "Error interno del servidor"];
  }
}
