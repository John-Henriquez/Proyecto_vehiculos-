"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getConductor,
  getAllConductores,
  createConductor,
  updateConductor,
  deleteConductor,
  assignConductor,
  releaseConductor,
} from "../controllers/conductor.controller.js";

const router = Router();

router.post("/add", authenticateJwt, isAdmin, createConductor);

router.get("/", authenticateJwt, isAdmin, getAllConductores);

router.get("/:rut_conductor", authenticateJwt, isAdmin, getConductor);

router.put("/edit/:rut_conductor", authenticateJwt, isAdmin, updateConductor);

router.delete("/delete/:rut_conductor", authenticateJwt, isAdmin, deleteConductor);

router.post("/assign", authenticateJwt, isAdmin, assignConductor);

router.post("/release", authenticateJwt, isAdmin, releaseConductor);

export default router;
