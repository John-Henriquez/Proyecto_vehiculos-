import { 
    createTipoVehiculoService,
    updateTipoVehiculoService,
    deleteTipoVehiculoService,
    getTipoVehiculosService
  } from "../services/tipo_vehiculo.service.js";  
  
  export const getTipoVehiculosController = async (req, res) => {
    try {
      const tipoVehiculos = await getTipoVehiculosService();
      return res.status(200).json(tipoVehiculos);
    } catch (error) {
      console.error("Error al obtener los tipos de vehículos:", error);
      return res.status(500).json({ message: "Error al obtener los tipos de vehículos" });
    }
  };
  
  export const createTipoVehiculoController = async (req, res) => {
    try {
      const { nombre } = req.body;
  
      if (!nombre) {
        return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
      }
  
      const tipoVehiculo = await createTipoVehiculoService({ nombre });
      return res.status(201).json({ message: "Tipo de vehículo creado exitosamente", tipoVehiculo });
    } catch (error) {
      console.error("Error al crear tipo de vehículo:", error);
      return res.status(500).json({ message: "Error al crear el tipo de vehículo" });
    }
  };

  export const updateTipoVehiculoController = async (req, res) => {
    try {
      const { id_tipo_vehiculo } = req.params;
      const { nombre } = req.body;
  
      if (!nombre) {
        return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
      }
  
      const tipoVehiculo = await updateTipoVehiculoService(id_tipo_vehiculo, { nombre });
      if (!tipoVehiculo) {
        return res.status(404).json({ message: "Tipo de vehículo no encontrado" });
      }
  
      return res.status(200).json({ message: "Tipo de vehículo actualizado", tipoVehiculo });
    } catch (error) {
      console.error("Error al actualizar tipo de vehículo:", error);
      return res.status(500).json({ message: "Error al actualizar el tipo de vehículo" });
    }
  };
  
  export const deleteTipoVehiculoController = async (req, res) => {
    try {
      const { id_tipo_vehiculo } = req.params;
      const tipoVehiculo = await deleteTipoVehiculoService(id_tipo_vehiculo);
  
      if (!tipoVehiculo) {
        return res.status(404).json({ message: "Tipo de vehículo no encontrado" });
      }
  
      return res.status(200).json({ message: "Tipo de vehículo eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar tipo de vehículo:", error);
      return res.status(500).json({ message: "Error al eliminar el tipo de vehículo" });
    }
  };
  