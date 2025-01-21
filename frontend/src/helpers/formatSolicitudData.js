import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatSolicitudData(solicitud) {
    return {
        ...solicitud,
        nombre_agrupacion: solicitud.nombre_agrupacion ? startCase(solicitud.nombre_agrupacion) : 'Desconocido',
        destino: solicitud.destino ? startCase(solicitud.destino) : 'No especificado',
        prioridad: solicitud.prioridad ? startCase(solicitud.prioridad) : 'Baja',
        rut_conductor: solicitud.rut_conductor ? formatRut(solicitud.rut_conductor) : 'No asignado',  
        nombre_conductor: solicitud.nombre_conductor ? startCase(solicitud.nombre_conductor) : 'Desconocido',
        fechaSalida: solicitud.fecha_salida ? formatTempo(solicitud.fecha_salida, "DD-MM-YYYY") : 'No definida',
        fechaSolicitud: solicitud.fecha_solicitud ? formatTempo(solicitud.fecha_solicitud, "DD-MM-YYYY") : 'No definida',
        placaPatente: solicitud.placa_patente ? solicitud.placa_patente.toUpperCase() : 'SIN PLACA',
        observaciones: solicitud.observaciones ? startCase(solicitud.observaciones) : 'Sin observaciones',
    };
}
