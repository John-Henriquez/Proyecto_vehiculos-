"use strict";
import { Router } from "express";
import {
  createSolicitud,
  deleteSolicitud,
  getAllSolicitudes,
  getSolicitud,
  updateSolicitud,
} from "../controllers/solicitud.controller.js";

const router = Router();

  
router
  .get("/", getAllSolicitudes)
  .get("/:id_solicitud", getSolicitud)
  .post("/add", createSolicitud)
  .put("/edit/:id_solicitud", updateSolicitud)
  .delete("/delete/:id_solicitud", deleteSolicitud);

export default router;
