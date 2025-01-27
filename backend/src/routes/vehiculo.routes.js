"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
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
router
  .get("/", getAllVehiculos)
  .get("/:placa", getVehiculo)
  .post("/add", createVehiculo, isAdmin)
  .patch("/edit/:placa", updateVehiculo, isAdmin)
  .delete("/delete/:placa", deleteVehiculo, isAdmin);

export default router;
