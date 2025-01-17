import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatSolicitudData(solicitud) {
    return {
        ...solicitud,
        nombre_agrupacion: startCase(solicitud.nombre_agrupacion),
        destino: startCase(solicitud.destino),
        prioridad: startCase(solicitud.prioridad),
        rut_conductor: formatRut(solicitud.rut_conductor), 
        nombre_conductor: startCase(solicitud.nombre_conductor),  
        fechaSalida: formatTempo(solicitud.fecha_salida, "DD-MM-YYYY"),
        fechaSolicitud: formatTempo(solicitud.fecha_solicitud, "DD-MM-YYYY"),
        placaPatente: solicitud.placa_patente.toUpperCase(),
        observaciones: solicitud.observaciones ? startCase(solicitud.observaciones) : null,
    };
}