"use strict";

import { AppDataSource } from "../config/configDb.js";
import { sendEmail } from  "../services/email.service.js";
import Registro from "../entity/registro.entity.js";
import Solicitud from "../entity/solicitud.entity.js";
import User from "../entity/user.entity.js";

async function scheduleEmail(emailTo, subject, text) {
  console.log(`Programando envío de correo a ${emailTo}`);
  try {
      const [info, error] = await sendEmail(emailTo, subject, text);
      if (error) {
          console.error("Error al enviar el correo:", error);
      } else {
          console.log("Correo enviado correctamente:", info.messageId);
      }
  } catch (error) {
      console.error("Error inesperado al enviar el correo:", error);
  }
}

export async function createSolicitudService(solicitudData, user) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    if (!solicitudData.rut_solicitante || !solicitudData.nombre_agrupacion || !solicitudData.numero_telefono || !solicitudData.estado || !solicitudData.prioridad || !solicitudData.id_tipo_vehiculo) {
      throw new Error("Faltan datos obligatorios");
    }

    const solicitud = solicitudRepository.create({
      ...solicitudData,
      rut_creador: user.rut,
      fecha_creacion: new Date(),
      rut_conductor: solicitudData.rut_conductor || null,
      placa_patente: solicitudData.placa_patente || null,
      cantidad_pasajeros: solicitudData.cantidad_pasajeros || null,
    });

    await solicitudRepository.save(solicitud);

    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function updateSolicitudService(id_solicitud, solicitudData) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
      const solicitudRepository = queryRunner.manager.getRepository(Solicitud);
      const registroRepository = queryRunner.manager.getRepository(Registro);
      const userRepository = queryRunner.manager.getRepository(User);

      // Bloquear el registro para evitar race conditions
      const solicitud = await solicitudRepository.findOne({
          where: { id_solicitud },
          lock: { mode: "pessimistic_write" }
      });

      if (!solicitud) throw new Error("Solicitud no encontrada");

      const estadoAnterior = solicitud.estado;
      const cambiosEstado = estadoAnterior !== solicitudData.estado;
      const nuevoEstadoValido = ["aceptada", "rechazada"].includes(solicitudData.estado);

      // Actualizar solo si hay cambios relevantes
      if (cambiosEstado && nuevoEstadoValido) {
          Object.assign(solicitud, solicitudData);
          await solicitudRepository.save(solicitud);

          const registro = registroRepository.create({
              id_solicitud: solicitud.id_solicitud,
              nombre_agrupacion: solicitud.nombre_agrupacion,
              num_telefono: solicitud.numero_telefono,
              fecha_solicitud: solicitud.fecha_creacion,
              fecha_salida: solicitud.fecha_salida,
              fecha_regreso: solicitud.estado === "aceptada" ? solicitud.fecha_regreso : null,
              destino: solicitud.destino,
              prioridad: solicitud.prioridad,
              estado: solicitud.estado,
              observaciones: solicitud.estado === "rechazada" ? solicitud.observaciones : null,
              placa_vehiculo: solicitud.placa_patente || null,
              rut_conductor: solicitud.rut_conductor || null,
              id_tipo_vechiculo: solicitud.id_tipo_vehiculo,
          });

          await registroRepository.save(registro);

          const user = await userRepository.findOne({ where: { rut: solicitud.rut_creador } });
          if (!user) throw new Error("Usuario no encontrado");

          const emailContent = {
              emailTo: user.email,
              subject: solicitud.estado === "aceptada" ? "Solicitud Aceptada" : "Solicitud Rechazada",
              text: solicitud.estado === "aceptada" 
                  ? `¡Tu solicitud ha sido aceptada!\n\nDetalles del vehículo: ${solicitud.placa_patente}\nDetalles del conductor: ${solicitud.rut_conductor}\nFecha de regreso: ${solicitud.fecha_regreso}`
                  : `Tu solicitud ha sido rechazada.\n\nObservaciones: ${solicitud.observaciones}`
          };

          // Envío fuera de la transacción
          await queryRunner.commitTransaction();
          
          // Separar completamente el envío del correo
          scheduleEmail(emailContent.emailTo, emailContent.subject, emailContent.text);
          
          return solicitud;
      }

      await queryRunner.commitTransaction();
      return solicitud;
  } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message || "Error al actualizar la solicitud");
  } finally {
      await queryRunner.release();
  }
}

export async function getAllSolicitudesService(user = null) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    
    if (!user || user.rol === "administrador") {
      return await solicitudRepository.find();
    }

    return await solicitudRepository.find({ where: { rut_creador: user.rut } });
    
  } catch (error) {
    throw new Error(`Error al obtener las solicitudes: ${error.message}`);
  }
}

export async function getSolicitudService(id_solicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al obtener la solicitud");
  }
}

export async function deleteSolicitudService(id_solicitud, user) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (user.rol !== "administrador" && solicitud.rut_solicitante !== user.rut) {
      throw new Error("No tienes permiso para eliminar esta solicitud");
    }

    await solicitudRepository.remove(solicitud);
    return "Solicitud eliminada";
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la solicitud");
  }
}
