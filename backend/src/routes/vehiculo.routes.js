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
  .get("/",authenticateJwt, getAllVehiculos)
  .get("/:placa", authenticateJwt, getVehiculo)
  .post("/add", authenticateJwt, createVehiculo, isAdmin)
  .patch("/edit/:placa", authenticateJwt, updateVehiculo, isAdmin)
  .delete("/delete/:placa",authenticateJwt, deleteVehiculo, isAdmin);

export default router;
