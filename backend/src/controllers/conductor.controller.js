"use strict";

import {
  getConductoresService,
  getAllConductoresService,
  assignConductorService,
  releaseConductorService,
  createConductorService,
  updateConductorService,
  deleteConductorService,
} from "../services/conductor.service.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getConductor(req, res) {
  try {
    const { rut_conductor } = req.params;
    const conductor = await getConductorService(rut_conductor);
    
    return handleSuccess(res, 200, "Conductor encontrado", conductor);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function getAllConductores(req, res) {
  try {
    const conductores = await getAllConductoresService();
    return handleSuccess(res, 200, "Conductores encontrados", conductores);
  } catch (error) {
    console.error("Error al obtener los conductores:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function assignConductor(req, res) {
  try {
    const { rut_conductor } = req.body;
    await assignConductorService(rut_conductor);

    return handleSuccess(res, 200, "Conductor asignado exitosamente");
  } catch (error) {
    console.error("Error al asignar el conductor:", error);
    return handleErrorClient(res, 400, error.message);
  }
}

export async function releaseConductor(req, res) {
  try {
    const { rut_conductor } = req.body;
    await releaseConductorService(rut_conductor);

    return handleSuccess(res, 200, "Conductor liberado exitosamente");
  } catch (error) {
    console.error("Error al liberar el conductor:", error);
    return handleErrorClient(res, 400, error.message);
  }
}

export async function createConductor(req, res) {
  try {
    const conductor = await createConductorService(req.body);
    return handleSuccess(res, 201, "Conductor creado exitosamente", conductor);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function updateConductor(req, res) {
  try {
    const { rut_conductor } = req.params;
    const conductor = await updateConductorService(rut_conductor, req.body);

    return handleSuccess(res, 200, "Conductor actualizado exitosamente", conductor);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function deleteConductor(req, res) {
  try{
    const { rut_conductor } = req.params;
    await deleteConductorService(rut_conductor);

    return handleSuccess(res, 200, "Conductor eliminado exitosamente");
  }catch(error){
    return handleErrorClient(res, 400, error.message);
  }
}
