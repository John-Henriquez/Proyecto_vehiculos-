"use strict";
import { AppDataSource } from "../config/configDb.js";
import AsignacionVehiculo from '../entity/asignacion.entity.js';
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import Vehiculo from '../entity/vehiculo.entity.js'; 
import Conductor from '../entity/conductor.entity.js';

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

export async function checkAvailabilityService({ fecha_salida, fecha_regreso }) {
  try {
    // Repositorios de Asignaciones, Vehículos y Conductores
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const conductorRepository = AppDataSource.getRepository(Conductor);

    // Buscar asignaciones de vehículos y conductores que ya están ocupados
    const conflicts = await asignacionRepository.find({
      where: [
        {
          fecha_salida: LessThanOrEqual(fecha_regreso),
          fecha_regreso: MoreThanOrEqual(fecha_salida),   
        },
      ],
    });

    // Obtener todos los vehículos y conductores
    const allVehicles = await vehiculoRepository.find();
    const allDrivers = await conductorRepository.find();

    // Filtrar los vehículos disponibles (sin conflictos de fechas)
    const vehiculosDisponibles = allVehicles.filter(vehicle => {
      return !conflicts.some(conflict => conflict.placa === vehicle.placa);
    });

    // Filtrar los conductores disponibles (sin conflictos de fechas)
    const conductoresDisponibles = allDrivers.filter(driver => {
      return !conflicts.some(conflict => conflict.rut_conductor === driver.rut_conductor);
    });

    return {
      vehiculosDisponibles,
      conductoresDisponibles
    };

  } catch (error) {
    throw new Error(error.message || "Error al verificar la disponibilidad");
  }
}

export async function getAssignedDatesService({ rut_conductor, placa }) {
  try {
    const asignacionRepository = AppDataSource.getRepository(AsignacionVehiculo);

    const whereConditions = {};
    if (rut_conductor) whereConditions.rut_conductor = rut_conductor;
    if (placa) whereConditions.placa = placa;

    const asignaciones = await asignacionRepository.find({
      where: [
        rut_conductor ? { rut_conductor } : null,
        placa ? { placa } : null
      ].filter(Boolean), 
      select: ["fecha_salida", "fecha_regreso"],
      order: { fecha_salida: "ASC" }
    });
    

    return asignaciones;
  } catch (error) {
    throw new Error(error.message || "Error al obtener las fechas de asignación");
  }
}
