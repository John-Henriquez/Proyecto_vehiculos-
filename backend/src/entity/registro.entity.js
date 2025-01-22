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
      nullable: false,
    },
    nombre_agrupacion: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    num_telefono: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
    fecha_solicitud: {
      type: "date",
      nullable: false,
    },
    fecha_salida: {
      type: "date",
      nullable: false,
    },
    fecha_regreso: {
      type: "date",
      nullable: true,
    },
    destino: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    prioridad: {
      type: "varchar",
      length: 10,
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
    placa_vehiculo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    rut_conductor: {
      type: "varchar",
      length: 15,
      nullable: true,
    },
    fecha_cambio_estado: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: { name: "placa_vehiculo", referencedColumnName: "placa" },
      onDelete: "SET NULL",
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
