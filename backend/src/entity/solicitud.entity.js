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
    fecha_salida: {
      type: "date",
      nullable: false,
    },
    nombre_agrupacion: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    num_telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    fecha_solicitud: {
      type: "date",
      nullable: true,
    },
    destino: {
      type: "varchar",
      length: 225,
      nullable: false,
    },
    placa_patente: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "pendiente",
      nullable: false,
    },
    observaciones: {
      type: "text",
      nullable: true,
    },
    rut_conductor: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    prioridad: {
      type: "varchar",
      length: 10,
      nullable: false, 
    },
    fecha_regreso: {
      type: "timestamp",
      nullable: true, 
    },
  },
  relations: {
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: { name: "placa_patente", referencedColumnName: "placa" },
      onDelete: "SET NULL",
    },
    conductor: {
      target: "Conductor",
      type: "many-to-one",
      joinColumn: { name: "rut_conductor", referencedColumnName: "rut_conductor" },
      onDelete: "SET NULL",
    },
    solicitud: {
      target: "Solicitud",
      type: "many-to-one",
      joinColumn: { name: "id_solicitud", referencedColumnName: "id_solicitud" },
      onDelete: "SET NULL",  // Cambiado para mantener registros
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
