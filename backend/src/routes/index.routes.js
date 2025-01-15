"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import recordRoutes from "./registro.routes.js";
import applicationRoutes from "./solicitud.routes.js";
import vehicleRoutes from "./vehiculo.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/record", recordRoutes)
    .use("/application", applicationRoutes)
    .use("/vehicle", vehicleRoutes)

export default router;