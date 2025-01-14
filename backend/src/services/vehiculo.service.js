"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Vehiculo  from "../entity/vehiculo.entity.js";
import TipoVehiculo from "../entity/tipo_vehiculo.entity.js";

export async function createVehiculoService(vehiculoData) {
  try {
    const { id_tipo_vehiculo, ...restoVehiculo } = vehiculoData;

    const tipoRepository = AppDataSource.getRepository(TipoVehiculo);
    const tipoVehiculo = await tipoRepository.findOne({ where: { id: id_tipo_vehiculo } });

    if (!tipoVehiculo) {
      return [null, "El tipo de vehículo no existe"];
    }

    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    
    const vehiculo = vehiculoRepository.create({
      ...restoVehiculo,
      tipo: tipoVehiculo, 
    });

    await vehiculoRepository.save(vehiculo);

    return [vehiculo, null];
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}


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


export async function getAllTiposVehiculoService() {
  try {
    const tipoRepository = AppDataSource.getRepository(TipoVehiculo);
    const tipos = await tipoRepository.find();
    return [tipos, null];
  } catch (error) {
    console.error("Error al obtener los tipos de vehículo:", error);
    return [null, "Error interno del servidor"];
  }
}

