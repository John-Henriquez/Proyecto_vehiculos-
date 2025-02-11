import { useState } from 'react';
import { deleteAsignacion } from '../services/asignacion.service';

export default function useDeleteAsignacion() {
    const [error, setError] = useState(null);

    const remove = async (id) => {
        try {
            return await deleteAsignacion(id);
        } catch (err) {
            setError(err.message);
        }
    };

    return { remove, error };
}
