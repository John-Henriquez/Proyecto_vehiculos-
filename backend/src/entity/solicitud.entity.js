"use strict";
import { EntitySchema } from "typeorm";

const SolicitudSchema = new EntitySchema({
  name: "Solicitud",
  tableName: "solicitudes",
  columns: {
    id_solicitud: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut_solicitante: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    placa_vehiculo: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    fecha_solicitud: {
      type: "date",
      nullable: false,
    },
    motivo: {
      type: "text",
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
  },
  relations: {
    solicitante: {
      target: "Solicitante",
      type: "many-to-one",
      joinColumn: { name: "rut_solicitante", referencedColumnName: "rut" },
      onDelete: "CASCADE",
    },
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: { name: "placa_vehiculo", referencedColumnName: "placa" },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_SOLICITUD_ID",
      columns: ["id_solicitud"],
      unique: true,
    },
  ],
});

export default SolicitudSchema;
