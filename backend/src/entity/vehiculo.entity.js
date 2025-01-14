"use strict";
import { EntitySchema } from "typeorm";

const VehiculoSchema = new EntitySchema({
  name: "Vehiculo",
  tableName: "vehiculos",
  columns: {
    placa: {
      type: "varchar",
      primary: true,
      length: 20,
    },
    tipo_vehiculo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    marca: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    anio_fabricacion: {
      type: "int",
      nullable: false,
    },
    equipamiento: {
      type: "text",
      nullable: true,
    },
    color: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    kilometraje: {
      type: "int",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_VEHICULO_PLACA",
      columns: ["placa"],
      unique: true,
    },
  ],
});

export default VehiculoSchema;
