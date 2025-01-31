"use strict";
import { AppDataSource } from "../config/configDb.js";
import AsignacionVehiculo from '../entity/asignacion.entity.js';

export async function createAsignacionService(data) {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    const nuevaAsignacion = asignacionRepository.create(data);
    await asignacionRepository.save(nuevaAsignacion);
    return nuevaAsignacion;
  } catch (error) {
    throw new Error(error.message || "Error al crear la asignación");
  }
}

export async function getAllAsignacionesService() {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    return await asignacionRepository.find({
      relations: ["vehiculo", "conductor", "solicitud"],
    });
  } catch (error) {
    throw new Error(error.message || "Error al obtener las asignaciones");
  }
}

export async function getAsignacionByIdService(id) {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    const asignacion = await asignacionRepository.findOne({
      where: { id },
      relations: ["vehiculo", "conductor", "solicitud"],
    });
    if (!asignacion) {
      throw new Error("Asignación no encontrada");
    }
    return asignacion;
  } catch (error) {
    throw new Error(error.message || "Error al obtener la asignación");
  }
}

export async function updateAsignacionService(id, data) {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    const asignacion = await getAsignacionByIdService(id);
    Object.assign(asignacion, data);
    await asignacionRepository.save(asignacion);
    return asignacion;
  } catch (error) {
    throw new Error(error.message || "Error al actualizar la asignación");
  }
}

export async function deleteAsignacionService(id) {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    const asignacion = await getAsignacionByIdService(id);
    await asignacionRepository.remove(asignacion);
    return true;
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la asignación");
  }
}