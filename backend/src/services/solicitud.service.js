"use strict";

import { AppDataSource } from "../config/configDb.js";
import { sendEmail } from  "../services/email.service.js";
import Registro from "../entity/registro.entity.js";
import Solicitud from "../entity/solicitud.entity.js";
import User from "../entity/user.entity.js";

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
    });

    await solicitudRepository.save(solicitud);

    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al crear la solicitud");
  }
}

export async function updateSolicitudService(id_solicitud, solicitudData) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const registroRepository = AppDataSource.getRepository(Registro);
    const userRepository = AppDataSource.getRepository(User);

    const solicitud = await solicitudRepository.findOne({ where: { id_solicitud } });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    const estadoAnterior = solicitud.estado;

    Object.keys(solicitudData).forEach((key) => {
      if (solicitudData[key] !== undefined) {
        solicitud[key] = solicitudData[key];
      }
    });

    await solicitudRepository.save(solicitud);

    if (
      (estadoAnterior !== solicitud.estado) && 
      (solicitud.estado === "aceptada" || solicitud.estado === "rechazada")
    ) {
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
      });

      await registroRepository.save(registro);

      const user = await userRepository.findOne({ where: { rut: solicitud.rut_creador } });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const emailTo = user.email; 
      const subject = solicitud.estado === "aceptada" ? "Solicitud Aceptada" : "Solicitud Rechazada";
      let text = '';

      if (solicitud.estado === "aceptada") {
        text = `¡Tu solicitud ha sido aceptada!\n\nDetalles del vehículo: ${solicitud.placa_patente}\nDetalles del conductor: ${solicitud.rut_conductor}\nFecha de regreso: ${solicitud.fecha_regreso}`;

      } else if (solicitud.estado === "rechazada") {
        text = `Tu solicitud ha sido rechazada.\n\nObservaciones: ${solicitud.observaciones}`;
      }

      setImmediate(async () => {
        await sendEmail(emailTo, subject, text);
      });
    }

    return solicitud;
  } catch (error) {
    throw new Error(error.message || "Error al actualizar la solicitud");
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
