import { useState } from 'react';
import { updateAsignacion } from '../services/asignacion.service';

export default function useUpdateAsignacion() {
    const [error, setError] = useState(null);

    const update = async (id, asignacion) => {
        try {
            return await updateAsignacion(id, asignacion);
        } catch (err) {
            setError(err.message);
        }
    };

    return { update, error };
}
