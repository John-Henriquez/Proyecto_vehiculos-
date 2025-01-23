import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";


export function formatSolicitudData(solicitud) {
    return {
        id_solicitud: solicitud.id_solicitud, // Mantiene el ID sin cambios
        nombre_agrupacion: solicitud.nombre_agrupacion ? startCase(solicitud.nombre_agrupacion.toLowerCase()) : 'Desconocido', // Formateo de agrupación
        destino: solicitud.destino ? startCase(solicitud.destino.toLowerCase()) : 'No especificado', // Formateo de destino
        prioridad: solicitud.prioridad ? startCase(solicitud.prioridad.toLowerCase()) : 'Baja', // Prioridad de solicitud
        rut_conductor: solicitud.rut_conductor ? formatRut(solicitud.rut_conductor) : 'No asignado', // Formato del RUT
        nombre_conductor: solicitud.nombre_conductor ? startCase(solicitud.nombre_conductor.toLowerCase()) : 'Desconocido', // Nombre del conductor
        fechaSalida: solicitud.fecha_salida ? formatTempo(new Date(solicitud.fecha_salida), "DD-MM-YYYY") : 'No definida', // Fecha de salida
        fechaSolicitud: solicitud.fecha_creacion ? formatTempo(new Date(solicitud.fecha_creacion), "DD-MM-YYYY") : 'No definida', // Fecha de solicitud
        fecha_regreso: solicitud.fecha_regreso ? formatTempo(new Date(solicitud.fecha_regreso), "DD-MM-YYYY") : 'No definida', // Fecha de regreso
        placaPatente: solicitud.placa_patente ? solicitud.placa_patente.toUpperCase() : 'SIN PLACA', // Placa del vehículo
        observaciones: solicitud.observaciones ? startCase(solicitud.observaciones.toLowerCase()) : 'Sin observaciones', // Observaciones
        cantidad_pasajeros: solicitud.cantidad_pasajeros ?? 'No disponible', // Cantidad de pasajeros (si es null, mostramos "No disponible")
        rut_creador: solicitud.rut_creador ? formatRut(solicitud.rut_creador) : 'No asignado', // RUT del creador
        rut_solicitante: solicitud.rut_solicitante ? formatRut(solicitud.rut_solicitante) : 'No asignado', // RUT del solicitante
    };
}
