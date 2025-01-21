"use strict";
import { EntitySchema } from "typeorm";

const RegistroSchema = new EntitySchema({
  name: "Registro",
  tableName: "registro_uso",
  columns: {
    id_registro: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_solicitud: {
      type: "int",
      generated: true,
    },
    placa_vehiculo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    fecha_solicitud: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    observaciones: {
      type: "text",
      nullable: true,
    },
    prioridad: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
    fecha_cambio_estado: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
  },
},
  relations: {
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: { name: "placa_vehiculo", referencedColumnName: "placa" },
      onDelete: "CASCADE",
    },
    solicitud: {
      target: "Solicitud",
      type: "many-to-one",
      joinColumn: { name: "id_solicitud", referencedColumnName: "id_solicitud" },
      onDelete: "SET NULL",
    },
  },
  indices: [
    {
      name: "IDX_REGISTRO_ID",
      columns: ["id_registro"],
      unique: true,
    },
  ],
});

export default RegistroSchema;
