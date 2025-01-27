"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { verifyUserPermission } from "../middlewares/permission.middleware.js";
import {
  createSolicitud,
  deleteSolicitud,
  getAllSolicitudes,
  getSolicitud,
  updateSolicitud,
} from "../controllers/solicitud.controller.js";

const router = Router();

router.post("/add", createSolicitud);

router.get("/", getAllSolicitudes);

router.get("/:id_solicitud", authenticateJwt, getSolicitud);

router.delete("/delete/:id_solicitud", authenticateJwt, isAdmin, deleteSolicitud);

router.patch("/edit/:id_solicitud", authenticateJwt, isAdmin, updateSolicitud);

export default router;
