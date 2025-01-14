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
  .get("/:id_solicitud", getSolicitud)
  .post("/add", createSolicitud)
  .patch("/edit/:id_solicitud", updateSolicitud)
  .delete("/delete/:id_solicitud", deleteSolicitud);

export default router;
