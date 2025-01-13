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
    nro_motor: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    transmision: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    tipo_combustible: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    cilindrada: {
      type: "int",
      nullable: false,
    },
    equipamiento: {
      type: "text",
      nullable: true,
    },
    puertas: {
      type: "int",
      nullable: false,
    },
    color: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    anio_permiso: {
      type: "int",
      nullable: false,
    },
    valor_total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    fecha_pago: {
      type: "date",
      nullable: false,
    },
    codigo_sii: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    folio_interno: {
      type: "varchar",
      length: 20,
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
