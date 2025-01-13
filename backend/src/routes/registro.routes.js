"use strict";
import { Router } from "express";
import { isAdminOrTechnician } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getAllRegistros,
  getRegistroById,
  createRegistro,
  deleteRegistro,
  updateRegistro,
} from "../controllers/registro.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdminOrTechnician); 

router
  .get("/", getAllRegistros)
  .get("/:id", getRegistroById)
  .post("/add", createRegistro)
  .patch("/edit/:id", updateRegistro)
  .delete("/delete/:id", deleteRegistro);

export default router;
