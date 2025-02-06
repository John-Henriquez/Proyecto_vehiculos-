import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatSolicitudData(solicitud) {
    function adjustToLocalTimezone(dateString) {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000; // Convertir minutos a milisegundos
        return new Date(date.getTime() + offset);
    }

    return {
        //id
        id_solicitud: solicitud.id_solicitud, 
        nombre_agrupacion: solicitud.nombre_agrupacion 
            ? startCase(solicitud.nombre_agrupacion.toLowerCase()) 
            : 'Desconocido', 
        //destino
        destino: solicitud.destino 
            ? startCase(solicitud.destino.toLowerCase()) 
            : 'No especificado', 
        prioridad: solicitud.prioridad 
            ? startCase(solicitud.prioridad.toLowerCase()) 
            : 'Baja',
        //rut_conductor 
        rut_conductor: solicitud.rut_conductor 
            ? formatRut(solicitud.rut_conductor) 
            : null, 
        //nombre_conductor 
        nombre_conductor: solicitud.nombre_conductor 
            ? startCase(solicitud.nombre_conductor.toLowerCase()) 
            : 'Desconocido', 
        //fecha_salida
        fechaSalida: solicitud.fecha_salida 
            ? formatTempo(adjustToLocalTimezone(solicitud.fecha_salida), "DD-MM-YYYY") 
            : null, 
        fecha_regreso: solicitud.fecha_regreso 
            ? formatTempo(adjustToLocalTimezone(solicitud.fecha_regreso), "DD-MM-YYYY") 
            : null,        
        //fecha_creacion 
        fechaSolicitud: solicitud.fecha_creacion 
        ? (() => {
            const date = new Date(solicitud.fecha_creacion); // Convertir timestamp a Date
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        })()
            : null, 
        //placa_patente
        placaPatente: solicitud.placa_patente 
            ? solicitud.placa_patente.toUpperCase() 
            : null,  
        //observaciones
        observaciones: solicitud.observaciones 
            ? startCase(solicitud.observaciones.toLowerCase()) 
            : null,  
        //cantidad_pasajeros
        cantidad_pasajeros: typeof solicitud.cantidad_pasajeros === 'number' 
            ? solicitud.cantidad_pasajeros 
            : null, 
        //rut_creador 
        rut_creador: solicitud.rut_creador 
            ? formatRut(solicitud.rut_creador) 
            : null, 
        //rut_solicitante 
        rut_solicitante: solicitud.rut_solicitante 
            ? formatRut(solicitud.rut_solicitante) 
            : null,  
        //id_tipo_vehiculo
        id_tipo_vehiculo: solicitud.id_tipo_vehiculo ?? null,
        //numero_telefono  
        numero_telefono: solicitud.numero_telefono 
            ? solicitud.numero_telefono 
            : null,  
        //estado
        estado: solicitud.estado 
            ? solicitud.estado.toLowerCase() 
            : 'pendiente'
    };
}