import { AppDataSource } from "../config/configDb.js";
import TipoVehiculo from "../entity/tipo_vehiculo.entity.js";

export const getTipoVehiculosService = async () => {
    try {
      const tipoVehiculoRepository = AppDataSource.getRepository(TipoVehiculo);
      const tipos = await tipoVehiculoRepository.find(); 
  
      return tipos;
    } catch (error) {
      console.error("Error al obtener los tipos de vehículos:", error);
      throw new Error("Error al obtener los tipos de vehículos");
    }
  };

  export const createTipoVehiculoService = async (tipoVehiculoData) => {
    try {
      const tipoVehiculoRepository = AppDataSource.getRepository(TipoVehiculo);
      const tipoVehiculo = tipoVehiculoRepository.create(tipoVehiculoData); // nombre y categoria
      await tipoVehiculoRepository.save(tipoVehiculo);
      return tipoVehiculo;
    } catch (error) {
      console.error("Error al crear tipo de vehículo:", error);
      throw new Error("Error al crear el tipo de vehículo");
    }
  };
  

export const updateTipoVehiculoService = async (id_tipo_vehiculo, tipoVehiculoData) => {
  try {
    const tipoVehiculoRepository = AppDataSource.getRepository(TipoVehiculo);
    const tipoVehiculo = await tipoVehiculoRepository.findOne({ where: { id_tipo_vehiculo } });

    if (!tipoVehiculo) {
      throw new Error("Tipo de vehículo no encontrado");
    }

    Object.keys(tipoVehiculoData).forEach((key) => {
      if (tipoVehiculoData[key] !== undefined) {
        tipoVehiculo[key] = tipoVehiculoData[key];
      }
    });

    await tipoVehiculoRepository.save(tipoVehiculo);
    return tipoVehiculo;
  } catch (error) {
    console.error("Error al actualizar tipo de vehículo:", error);
    throw new Error("Error al actualizar el tipo de vehículo");
  }
};

export const deleteTipoVehiculoService = async (id_tipo_vehiculo) => {
  try {
    const tipoVehiculoRepository = AppDataSource.getRepository(TipoVehiculo);
    const tipoVehiculo = await tipoVehiculoRepository.findOne({ where: { id_tipo_vehiculo } });

    if (!tipoVehiculo) {
      throw new Error("Tipo de vehículo no encontrado");
    }

    await tipoVehiculoRepository.remove(tipoVehiculo);
    return tipoVehiculo;
  } catch (error) {
    console.error("Error al eliminar tipo de vehículo:", error);
    throw new Error("Error al eliminar el tipo de vehículo");
  }
};
