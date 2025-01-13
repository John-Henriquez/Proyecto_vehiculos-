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
  .get("/:id", getSolicitante)
  .post("/add", createSolicitante)
  .patch("/edit/:id", updateSolicitante)
  .delete("/delete/:id", deleteSolicitante);

export default router;
