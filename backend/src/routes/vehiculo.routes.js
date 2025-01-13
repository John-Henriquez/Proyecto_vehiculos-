"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createVehiculo,
  deleteVehiculo,
  getAllVehiculos,
  getVehiculo,
  updateVehiculo,
} from "../controllers/vehiculo.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician);  

router
  .get("/", getAllVehiculos)
  .get("/:placa", getVehiculo)
  .post("/add", createVehiculo)
  .patch("/edit/:placa", updateVehiculo)
  .delete("/delete/:placa", deleteVehiculo);

export default router;
