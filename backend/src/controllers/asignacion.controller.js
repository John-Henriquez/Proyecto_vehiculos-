"use strict";
import {
  createAsignacionService,
  getAllAsignacionesService,
  getAsignacionByIdService,
  updateAsignacionService,
  deleteAsignacionService,
} from '../services/asignacion.service.js';
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createAsignacion(req, res) {
  try {
    const nuevaAsignacion = await createAsignacionService(req.body);
    return handleSuccess(res, 201, "Asignación creada exitosamente", nuevaAsignacion);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
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