import { EntitySchema } from "typeorm";

const TipoVehiculoSchema = new EntitySchema({
  name: "TipoVehiculo",
  tableName: "tipo_vehiculo",
  columns: {
    id_tipo_vehiculo: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 50,
    },
  },
relations: {
  vehiculos: {
    target: "Vehiculo",
    type: "one-to-many",
    inverseSide: "tipoVehiculo", 
    cascade: true,
  },
},
});

export default TipoVehiculoSchema;
