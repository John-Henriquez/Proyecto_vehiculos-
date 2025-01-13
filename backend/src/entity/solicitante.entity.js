"use strict";
import { EntitySchema } from "typeorm";

const SolicitanteSchema = new EntitySchema({
  name: "Solicitante",
  tableName: "solicitantes",
  columns: {
    rut: {
      type: "varchar",
      primary: true,
      length: 20,
    },
    tipo_solicitante: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    direccion: {
      type: "text",
      nullable: true,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    email: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
  },
  indices: [
    {
      name: "IDX_SOLICITANTE_RUT",
      columns: ["rut"],
      unique: true,
    },
  ],
});

export default SolicitanteSchema;
