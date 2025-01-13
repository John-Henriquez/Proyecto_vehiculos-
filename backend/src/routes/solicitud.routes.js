"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createSolicitud,
  deleteSolicitud,
  getAllSolicitudes,
  getSolicitud,
  updateSolicitud,
} from "../controllers/solicitud.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician);  
  
router
  .get("/", getAllSolicitudes)
  .get("/:id", getSolicitud)
  .post("/add", createSolicitud)
  .patch("/edit/:id", updateSolicitud)
  .delete("/delete/:id", deleteSolicitud);

export default router;
