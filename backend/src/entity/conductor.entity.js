"use strict";
import { EntitySchema } from "typeorm";

const ConductorSchema = new EntitySchema({
  name: "Conductor",
  tableName: "conductores",
  columns: {
    rut_conductor: {
      type: "varchar",
      length: 20,
      primary: true,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "disponible", 
    },
    fecha_liberacion: {
      type: "timestamp",
      nullable: true,
    }
  },
  relations: {
    solicitudes: {
      target: "Solicitud",
      type: "one-to-many",
      inverseSide: "conductor",
    },
  },
});

export default ConductorSchema;
