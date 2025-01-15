"use strict";

import {
  getConductorService,
  getAllConductoresService,
  assignConductorService,
  releaseConductorService,
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
    if (!conductor) {
      return handleErrorClient(res, 404, "Conductor no encontrado");
    }

    return handleSuccess(res, 200, "Conductor encontrado", conductor);
  } catch (error) {
    console.error("Error al obtener el conductor:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getAllConductores(req, res) {
  try {
    const conductores = await getAllConductoresService();
    if (!conductores || conductores.length === 0) {
      return handleErrorClient(res, 404, "No hay conductores registrados");
    }

    return handleSuccess(res, 200, "Conductores encontrados", conductores);
  } catch (error) {
    console.error("Error al obtener los conductores:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function assignConductor(req, res) {
  try {
    const { rut_conductor } = req.body;

    if (!rut_conductor) {
      return handleErrorClient(res, 400, "Falta el rut del conductor");
    }

    await assignConductorService(rut_conductor);
    return handleSuccess(res, 200, "Conductor asignado exitosamente");
  } catch (error) {
    console.error("Error al asignar el conductor:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function releaseConductor(req, res) {
  try {
    const { rut_conductor } = req.body;

    if (!rut_conductor) {
      return handleErrorClient(res, 400, "Falta el rut del conductor");
    }

    await releaseConductorService(rut_conductor);
    return handleSuccess(res, 200, "Conductor liberado exitosamente");
  } catch (error) {
    console.error("Error al liberar el conductor:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
