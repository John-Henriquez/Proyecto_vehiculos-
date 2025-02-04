import { useState } from 'react';
import { createAsignacion } from '../services/asignacion.service';

export default function useCreateAsignacion() {
    const [error, setError] = useState(null);

    const create = async (asignacion) => {
        try {
            return await createAsignacion(asignacion);
        } catch (err) {
            setError(err.message);
        }
    };

    return { create, error };
}
