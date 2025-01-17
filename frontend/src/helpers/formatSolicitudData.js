import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatSolicitudData(solicitud) {
    return {
        ...solicitud,
        nombreAgrupacion: startCase(solicitud.nombre_agrupacion),
        destino: startCase(solicitud.destino),
        prioridad: startCase(solicitud.prioridad),
        rutConductor: formatRut(solicitud.rut_conductor),
        fechaSalida: formatTempo(solicitud.fecha_salida, "DD-MM-YYYY"),
        fechaSolicitud: formatTempo(solicitud.fecha_solicitud, "DD-MM-YYYY"),
        placaPatente: solicitud.placa_patente.toUpperCase(),
        observaciones: solicitud.observaciones ? startCase(solicitud.observaciones) : null,
    };
}
