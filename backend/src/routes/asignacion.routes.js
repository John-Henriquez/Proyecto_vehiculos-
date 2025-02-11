"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createAsignacion,
  getAllAsignaciones,
  getAsignacionById,
  updateAsignacion,
  deleteAsignacion,
  checkAvailabilityController,
  getAssignedDates,
} from '../controllers/asignacion.controller.js';

const router = Router();

// Crear una nueva asignación
router.post("/add", authenticateJwt, isAdmin, createAsignacion);

// Obtener todas las asignaciones
router.get("/", authenticateJwt, getAllAsignaciones);

// Consultar disponibilidad
router.get("/availability", authenticateJwt, checkAvailabilityController);

// Obtener fechas de asignación para un conductor o vehículo específico
router.get("/assigned-dates", authenticateJwt, getAssignedDates);

// Obtener una asignación por ID
router.get("/:id", authenticateJwt, getAsignacionById);

// Actualizar una asignación
router.put("/edit/:id", authenticateJwt, isAdmin, updateAsignacion);

// Eliminar una asignación
router.delete("/delete/:id", authenticateJwt, isAdmin, deleteAsignacion);





export default router;