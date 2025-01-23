import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatSolicitudData(solicitud) {
    return {
        id_solicitud: solicitud.id_solicitud, 
        nombre_agrupacion: solicitud.nombre_agrupacion ? startCase(solicitud.nombre_agrupacion.toLowerCase()) : 'Desconocido', 
        destino: solicitud.destino ? startCase(solicitud.destino.toLowerCase()) : 'No especificado', 
        prioridad: solicitud.prioridad ? startCase(solicitud.prioridad.toLowerCase()) : 'Baja', 
        rut_conductor: solicitud.rut_conductor ? formatRut(solicitud.rut_conductor) : 'No asignado', 
        nombre_conductor: solicitud.nombre_conductor ? startCase(solicitud.nombre_conductor.toLowerCase()) : 'Desconocido', 
        fechaSalida: solicitud.fecha_salida ? formatTempo(new Date(solicitud.fecha_salida), "DD-MM-YYYY") : 'No definida', 
        fechaSolicitud: solicitud.fecha_creacion ? formatTempo(new Date(solicitud.fecha_creacion), "DD-MM-YYYY") : 'No definida', 
        fecha_regreso: solicitud.fecha_regreso ? formatTempo(new Date(solicitud.fecha_regreso), "DD-MM-YYYY") : 'No definida', 
        placaPatente: solicitud.placa_patente ? solicitud.placa_patente.toUpperCase() : 'SIN PLACA', 
        observaciones: solicitud.observaciones ? startCase(solicitud.observaciones.toLowerCase()) : 'Sin observaciones', 
        cantidad_pasajeros: solicitud.cantidad_pasajeros ?? 'No disponible', 
        rut_creador: solicitud.rut_creador ? formatRut(solicitud.rut_creador) : 'No asignado',
        rut_solicitante: solicitud.rut_solicitante ? formatRut(solicitud.rut_solicitante) : 'No asignado', 
        id_tipo_vehiculo: solicitud.id_tipo_vehiculo ?? 'No especificado', 
        numero_telefono: solicitud.numero_telefono ?? 'No disponible', 
        estado: solicitud.estado ? solicitud.estado.toLowerCase() : 'pendiente'
    };
}
