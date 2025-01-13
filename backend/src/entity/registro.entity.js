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
    placa_vehiculo: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    id_solicitud: {
      type: "int",
      nullable: false,
    },
    fecha_inicio: {
      type: "date",
      nullable: false,
    },
    fecha_fin: {
      type: "date",
      nullable: false,
    },
    kilometraje_inicio: {
      type: "int",
      nullable: false,
    },
    kilometraje_fin: {
      type: "int",
      nullable: false,
    },
    comentarios: {
      type: "text",
      nullable: true,
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
      onDelete: "CASCADE",
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
