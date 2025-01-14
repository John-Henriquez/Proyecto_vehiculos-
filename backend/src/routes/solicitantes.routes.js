"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createSolicitante,
  deleteSolicitante,
  getAllSolicitantes,
  getSolicitante,
  updateSolicitante,
} from "../controllers/solicitante.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician);  
  
router
  .get("/", getAllSolicitantes)
  .get("/:rut", getSolicitante)
  .post("/add", createSolicitante)
  .patch("/edit/:rut", updateSolicitante)
  .delete("/delete/:rut", deleteSolicitante);

export default router;
