"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entity/Vehiculo.js";

// Servicio para crear un vehículo
export async function createVehiculoService(vehiculoData) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    
    const vehiculo = vehiculoRepository.create(vehiculoData);
    await vehiculoRepository.save(vehiculo);

    return [vehiculo, null];
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todos los vehículos
export async function getAllVehiculosService() {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculos = await vehiculoRepository.find();

    return [vehiculos, null];
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener un vehículo por placa
export async function getVehiculoService(placa) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ placa });

    if (!vehiculo) {
      return [null, "Vehículo no encontrado"];
    }

    return [vehiculo, null];
  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar un vehículo
export async function updateVehiculoService(placa, vehiculoData) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ placa });

    if (!vehiculo) {
      return [null, "Vehículo no encontrado"];
    }

    vehiculoRepository.merge(vehiculo, vehiculoData);
    await vehiculoRepository.save(vehiculo);

    return [vehiculo, null];
  } catch (error) {
    console.error("Error al actualizar el vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar un vehículo
export async function deleteVehiculoService(placa) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ placa });

    if (!vehiculo) {
      return [null, "Vehículo no encontrado"];
    }

    await vehiculoRepository.remove(vehiculo);

    return [vehiculo, null];
  } catch (error) {
    console.error("Error al eliminar el vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}
