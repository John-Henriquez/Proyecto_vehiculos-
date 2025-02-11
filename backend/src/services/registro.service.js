"use strict";

import { AppDataSource } from "../config/configDb.js";
import Registro from "../entity/registro.entity.js";
import Solicitud from "../entity/solicitud.entity.js";
import AsignacionVehiculo from "../entity/asignacion.entity.js";

export async function createRegistroService(solicitud) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);

    const registroData = {
      id_solicitud: solicitud.id_solicitud,
      nombre_agrupacion: solicitud.nombre_agrupacion,
      num_telefono: solicitud.numero_telefono,
      fecha_solicitud: solicitud.fecha_creacion,
      fecha_salida: solicitud.fecha_salida,
      fecha_regreso: solicitud.fecha_regreso || null,  
      destino: solicitud.destino,
      prioridad: solicitud.prioridad,
      estado: solicitud.estado,  
      observaciones: solicitud.observaciones || null,  
      placa_vehiculo: solicitud.placa_vehiculo || null,  
      rut_conductor: solicitud.rut_conductor || null,
      fecha_cambio_estado: new Date(),
    };

    const registro = registroRepository.create(registroData);
    await registroRepository.save(registro);

    return [registro, null]; 
  } catch (error) {
    console.error("Error al crear el registro:", error);
    return [null, error.message || "Error interno del servidor"];
  }
}

export async function getAllRegistrosService() {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registros = await registroRepository.find({
      relations: ["vehiculo", "solicitud"], // Incluye relaciones
    });

    return [registros, null];
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRegistroService(id_registro) {
  try {
    const registroRepository = AppDataSource.getRepository(Registro);
    const registro = await registroRepository.findOne({ 
      where: { id_registro },
      relations: ["vehiculo", "solicitud"],  // Incluye relaciones
    });

    if (!registro) {
      return [null, "Registro no encontrado"];
    }

    return [registro, null];
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateRegistroService(id_registro, registroData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const registroRepository = queryRunner.manager.getRepository(Registro);
    const asignacionRepository = queryRunner.manager.getRepository(AsignacionVehiculo);
    
    // Obtener el registro actual
    const registro = await registroRepository.findOne({ where: { id_registro } });

    if (!registro) {
      throw new Error("Registro no encontrado");
    }

    // Detectar cambio de estado
    const estadoActual = registro.estado;
    const nuevoEstado = registroData.estado;

    if (estadoActual === "aceptada" && nuevoEstado === "rechazada") {
      // Cambia de aceptada a rechazada: eliminar asignación y datos relacionados
      await asignacionRepository.delete({ id_solicitud: registro.id_solicitud });
      registro.placa_vehiculo = null;
      registro.rut_conductor = null;
      registro.estado = nuevoEstado;
    } else if (estadoActual === "rechazada" && nuevoEstado === "aceptada") {
      // Cambia de rechazada a aceptada: validar datos necesarios y crear/actualizar asignación
      if (!registroData.placa_vehiculo || !registroData.rut_conductor || !registroData.fecha_salida) {
        throw new Error("Datos insuficientes para aceptar la solicitud");
      }

      registro.fecha_salida = registroData.fecha_salida;
      registro.fecha_regreso = registroData.fecha_regreso;
      registro.placa_vehiculo = registroData.placa_vehiculo;
      registro.rut_conductor = registroData.rut_conductor;

      await asignacionRepository.upsert(
        {
          id_solicitud: registro.id_solicitud,
          fecha_salida: registroData.fecha_salida,
          fecha_regreso: registroData.fecha_regreso,
          placa: registroData.placa_vehiculo,
          rut_conductor: registroData.rut_conductor,
          estado: "activo",
        },
        ["id_solicitud"]
      );
    } else {
      // Edición normal sin cambio de estado
      registroRepository.merge(registro, registroData);
    }

    await registroRepository.save(registro);
    await queryRunner.commitTransaction();

    return [registro, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al actualizar el registro:", error);
    return [null, error.message || "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}


export async function deleteRegistroService(id_registro) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const registroRepository = queryRunner.manager.getRepository(Registro);
    const asignacionRepository = queryRunner.manager.getRepository(AsignacionVehiculo);
    const solicitudRepository = queryRunner.manager.getRepository(Solicitud);

    const registro = await registroRepository.findOne({ where: { id_registro } });
    if (!registro) {
      throw new Error("Registro no encontrado");
    }

    // Obtener la solicitud asociada
    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud: registro.id_solicitud } });
    if (!solicitud) {
      throw new Error("Solicitud asociada no encontrada");
    }

    // Verificar el estado de la solicitud
    if (solicitud.estado === "pendiente") {
      throw new Error("No se puede eliminar un registro relacionado con una solicitud pendiente");
    }

    // Eliminar asignaciones relacionadas con la solicitud
    await asignacionRepository.delete({ id_solicitud: solicitud.id_solicitud });

    // Eliminar el registro
    await registroRepository.remove(registro);

    // Eliminar la solicitud después de eliminar asignaciones y registro
    await solicitudRepository.remove(solicitud);

    await queryRunner.commitTransaction();
    return [true, "Registro, asignación y solicitud eliminados correctamente"];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error al eliminar el registro completo:", error);
    return [false, error.message || "Error interno del servidor"];
  } finally {
    await queryRunner.release();
  }
}
