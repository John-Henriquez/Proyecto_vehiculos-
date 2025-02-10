"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

import {
  createSolicitud,
  deleteSolicitud,
  getAllSolicitudes,
  getSolicitud,
  updateSolicitud,
  getSolicitudesByCategoria,
} from "../controllers/solicitud.controller.js";

const router = Router();

router.post("/add",authenticateJwt, createSolicitud);

router.get("/", getAllSolicitudes);

router.get("/:id_solicitud", authenticateJwt, getSolicitud);

router.delete("/delete/:id_solicitud", authenticateJwt, deleteSolicitud);

router.patch("/edit/:id_solicitud", authenticateJwt, updateSolicitud);

router.get("/categoria/:categoria", authenticateJwt, getSolicitudesByCategoria);

export default router;
