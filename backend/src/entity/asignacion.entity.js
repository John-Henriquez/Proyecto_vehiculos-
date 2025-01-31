import { EntitySchema } from "typeorm";

const AsignacionVehiculoSchema = new EntitySchema({
  name: "AsignacionVehiculo",
  tableName: "asignaciones_vehiculos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true, // Autoincremental
    },
    rut_conductor: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    placa: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    id_solicitud: {
      type: "int",
      nullable: false,
    },
    fecha_salida: {
      type: "timestamp",
      nullable: false,
    },
    fecha_regreso: {
      type: "timestamp",
      nullable: false
    },
    estado: {
      type: "enum",
      enum: ["en espera", "activo", "completado"],
      default: "en espera",
      nullable: false,
    },
  },
  relations: {
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: {
        name: "placa",
        referencedColumnName: "placa",
      },
    },
    conductor: {
      target: "Conductor",
      type: "many-to-one",
      joinColumn: {
        name: "rut_conductor",
        referencedColumnName: "rut_conductor",
      },
    },
    solicitud: {
      target: "Solicitud",
      type: "many-to-one",
      joinColumn: {
        name: "id_solicitud",
        referencedColumnName: "id_solicitud",
      },
    },
  },
});

export default AsignacionVehiculoSchema;