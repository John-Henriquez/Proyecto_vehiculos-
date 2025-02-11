import express from "express";
import { 
    createTipoVehiculoController, 
    updateTipoVehiculoController, 
    deleteTipoVehiculoController, 
    getTipoVehiculosController 
} from "../controllers/tipo_vehiculo.controller.js";

const router = express.Router();

router.get("/", getTipoVehiculosController);

router.post("/add", createTipoVehiculoController);

router.patch("/:id_tipo_vehiculo", updateTipoVehiculoController);

router.delete("/:id_tipo_vehiculo", deleteTipoVehiculoController);

export default router;
