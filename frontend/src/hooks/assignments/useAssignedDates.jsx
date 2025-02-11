import { useEffect, useState } from 'react';
import { getAssignedDates } from '../../services/asignacion.service';

export default function useAssignedDates({ rut_conductor = null, placa = null }) {
    const [assignedDates, setAssignedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignedDates = async () => {
            try {
                if (!rut_conductor && !placa) {
                    throw new Error("Debe proporcionar rut_conductor o placa");
                }
                const data = await getAssignedDates(rut_conductor, placa);
                setAssignedDates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedDates();
    }, [rut_conductor, placa]);

    return { assignedDates, loading, error };
}
