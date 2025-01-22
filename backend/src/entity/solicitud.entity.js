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
    rut_creador: {
      type: "varchar",
      length: 20,
      nullable: false, 
    },
    nombre_agrupacion: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    numero_telefono: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    fecha_creacion: {
      type: "date",
      default: () => "CURRENT_DATE",
      nullable: false,
    },
    fecha_salida: {
      type: "date",
      nullable: true,
    },
    destino: {
      type: "varchar",
      length: 225,
      nullable: true,
    },
    placa_patente: {
      type: "varchar",
      length: 20,
      nullable: true,
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
    cantidad_pasajeros: {
      type: "int",
      nullable: true,
    },
    id_tipo_vehiculo: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    tipoVehiculo: {
      target: "TipoVehiculo",
      type: "many-to-one",
      joinColumn: {
        name: "id_tipo_vehiculo",
        referencedColumnName: "id_tipo_vehiculo",
      },
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
