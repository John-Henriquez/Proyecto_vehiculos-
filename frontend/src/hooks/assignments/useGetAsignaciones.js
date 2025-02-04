import { useEffect, useState } from 'react';
import { getAllAsignaciones } from '../services/asignacion.service';

export default function useGetAsignaciones() {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAsignaciones = async () => {
            try {
                const data = await getAllAsignaciones();
                setAsignaciones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAsignaciones();
    }, []);

    return { asignaciones, loading, error };
}
