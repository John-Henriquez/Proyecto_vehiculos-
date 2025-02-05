"use strict";
import {
  createAsignacionService,
  getAllAsignacionesService,
  getAsignacionByIdService,
  updateAsignacionService,
  deleteAsignacionService,
  checkAvailabilityService,
} from '../services/asignacion.service.js';
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";



export async function createAsignacion(req, res) {
  try {
    const { rut_conductor, placa, fecha_salida, fecha_regreso } = req.body;

    const isAvailable = await checkAvailabilityService({
      rut_conductor,
      placa,
      fecha_salida,
      fecha_regreso,
    });

    if (!isAvailable) {
      return handleErrorClient(res, 400, "El conductor o vehículo no está disponible en este período");
    }

    const nuevaAsignacion = await createAsignacionService(req.body);
    return handleSuccess(res, 201, "Asignación creada exitosamente", nuevaAsignacion);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function getAllAsignaciones(req, res) {
  try {
    const asignaciones = await getAllAsignacionesService();
    return handleSuccess(res, 200, "Asignaciones encontradas", asignaciones);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getAsignacionById(req, res) {
  try {
    const { id } = req.params;
    const asignacion = await getAsignacionByIdService(id);
    return handleSuccess(res, 200, "Asignación encontrada", asignacion);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function updateAsignacion(req, res) {
  try {
    const { id } = req.params;
    const asignacion = await updateAsignacionService(id, req.body);
    return handleSuccess(res, 200, "Asignación actualizada exitosamente", asignacion);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function deleteAsignacion(req, res) {
  try {
    const { id } = req.params;
    await deleteAsignacionService(id);
    return handleSuccess(res, 200, "Asignación eliminada exitosamente");
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function checkAvailabilityController(req, res) {
  try {
    const { fecha_salida, fecha_regreso } = req.query;

    const disponibilidad = await checkAvailabilityService({
      fecha_salida,
      fecha_regreso
    });

    return res.status(200).json({
      status: "success",
      message: "Disponibilidad de vehículos y conductores",
      data: disponibilidad
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
}
