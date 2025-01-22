"use strict";
import { getSolicitudService } from "../services/solicitud.service.js";
import {
  getAllRegistrosService, 
  getRegistroService, 
  createRegistroService, 
  deleteRegistroService, 
  updateRegistroService 
} from "../services/registro.service.js";

export async function getAllRegistros(req, res) {
  try {
    const [registros, error] = await getAllRegistrosService();

    if (error || !registros) {
      return res.status(404).json({ error: "No se encontraron registros" });
    }

    return res.json(registros);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getRegistroById(req, res) {
  try {
    const { id_registro } = req.params;
    const [registro, error] = await getRegistroService(id_registro);

    if (error || !registro) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    return res.json(registro);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getRegistrosByVehiculo(req, res) {
  try {
    const { placa } = req.params;
    const [registros, error] = await getAllRegistrosService();

    if (error || !registros) {
      return res.status(404).json({ error: "No se encontraron registros" });
    }

    const registrosFiltrados = registros.filter(registro => registro.placa_vehiculo === placa);

    if (registrosFiltrados.length === 0) {
      return res.status(404).json({ error: "No se encontraron registros para este vehículo" });
    }

    return res.json(registrosFiltrados);
  } catch (error) {
    console.error("Error al obtener los registros del vehículo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createRegistro(req, res) {
  try {
    const { id_solicitud } = req.body;  
    console.log("registro.controller - Creando registro para la solicitud con ID:", id_solicitud);
    const [solicitud, errorSolicitud] = await getSolicitudService(id_solicitud); 

    if (errorSolicitud || !solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    const [registro, error] = await createRegistroService(solicitud);

    if (error || !registro) {
      return res.status(500).json({ error: error || "No se pudo crear el registro" });
    }

    return res.status(201).json(registro);
  } catch (error) {
    console.error("Error al crear el registro:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteRegistro(req, res) {
  try {
    const { id_registro } = req.params;  
    const [registro, error] = await deleteRegistroService(id_registro);

    if (error || !registro) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    return res.status(200).json({ message: "Registro eliminado correctamente", registro });
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateRegistro(req, res) {
  try {
    const { id_registro } = req.params; 
    const registroData = req.body;  
    const [registro, error] = await updateRegistroService(id_registro, registroData);

    if (error || !registro) {
      return res.status(404).json({ error: "Registro no encontrado o no se pudo actualizar" });
    }

    return res.status(200).json({ message: "Registro actualizado correctamente", registro });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
