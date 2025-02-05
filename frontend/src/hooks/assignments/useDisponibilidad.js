// hooks/useDisponibilidad.js
import { useState, useEffect } from 'react';
import { getDisponibilidad } from '../services/asignacion.service';

export default function useDisponibilidad(fecha_salida, fecha_regreso) {
    const [disponibilidad, setDisponibilidad] = useState({
        vehiculosDisponibles: [],
        conductoresDisponibles: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDisponibilidad = async () => {
            try {
                const data = await getDisponibilidad(fecha_salida, fecha_regreso);
                setDisponibilidad(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (fecha_salida && fecha_regreso) {
            fetchDisponibilidad();
        }
    }, [fecha_salida, fecha_regreso]);

    return { disponibilidad, loading, error };
}
