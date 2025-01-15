"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createRegistro,
  deleteRegistro,
  getAllRegistros,
  getRegistroById,
  updateRegistro,
} from "../controllers/registro.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician); 

router
  .get("/", getAllRegistros)
  .get("/:id_registro", getRegistroById)
  .post("/add", createRegistro)
  .patch("/edit/:id_registro", updateRegistro)
  .delete("/delete/:id_registro", deleteRegistro);

export default router;
