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
    capacidad_maxima: {
      type: "int",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    id_tipo_vehiculo: {
      type: "int",
      nullable: false,
    },
    marca: {
      type: "varchar",
      length: 100,  // Puedes ajustar el tamaño dependiendo del tipo de marca
      nullable: false, // Si es obligatorio
    },
    modelo: {
      type: "varchar",
      length: 100,  // Ajusta el tamaño dependiendo del modelo
      nullable: false, // Si es obligatorio
    },
    año_fabricacion: {
      type: "int",
      nullable: false,  // Si es obligatorio, si no puedes ponerlo como nullable: true
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
    },
  },
});

export default VehiculoSchema;
