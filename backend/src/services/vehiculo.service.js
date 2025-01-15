"use strict";

import { AppDataSource } from "../config/configDb.js";
import  Vehiculo  from "../entity/vehiculo.entity.js";
import TipoVehiculo from "../entity/tipo_vehiculo.entity.js";

export async function createVehiculoService(vehiculoData) {
  try {

    if(!vehiculoData.placa || !vehiculoData.id_tipo_vehiculo || !vehiculoData.capacidad_maxima || !vehiculoData.estado){
      return [null, "Faltan datos"];
    }
    const placaRegex = /^[A-Z0-9-]+$/;
    if (!placaRegex.test(vehiculoData.placa)) {
      return [null, "La placa debe contener solo letras mayúsculas, números y guiones"];
    }


    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    
    const vehiculo = vehiculoRepository.create(vehiculoData);
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

    if (!vehiculos) {
      return [null, "No hay vehículos registrados"];
    }
    return [vehiculos, null];
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getVehiculoService(placa) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOne({where: {placa}});

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
    const vehiculo = await vehiculoRepository.findOne({where: {placa}});

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
    const vehiculo = await vehiculoRepository.findOne({where: {placa}});

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

