import RegistrosTable from '../components/RegistroTable.jsx';
import { useState, useEffect } from 'react';
import { getAllSolicitudes } from '../services/solicitudes.service.js';  
import useGetRegistros from '../hooks/records/useGetRegistros.jsx';  
import { acceptRegistro, rejectRegistro } from '../services/registro.service.js';  

const RegistroSolicitudes = () => {
    const { registros, fetchRegistros } = useGetRegistros();  
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const fetchedSolicitudes = await getAllSolicitudes();
            if (Array.isArray(fetchedSolicitudes)) {
                setSolicitudes(fetchedSolicitudes);
            } else {
                console.error('La respuesta de solicitudes no es un arreglo:', fetchedSolicitudes);
                setSolicitudes([]); 
            }
        };
        fetchSolicitudes();
    }, []);
    

    const solicitudesRegistradas = solicitudes.filter(
        (solicitud) => solicitud.estado === 'aprobada' || solicitud.estado === 'rechazada'
    );

    const solicitudesFiltradas = solicitudesRegistradas.map(solicitud => ({
        placa_vehiculo: solicitud.placa_patente,
        fecha_solicitud: solicitud.fecha_solicitud,
        estado: solicitud.estado,
        observaciones: solicitud.observaciones,
        prioridad: solicitud.prioridad,
    }));

    const handleAcceptRegistro = async (id_registro) => {
        const response = await acceptRegistro(id_registro);
        if (response) {
            fetchRegistros();  
        }
    };

    const handleRejectRegistro = async (id_registro) => {
        const response = await rejectRegistro(id_registro);
        if (response) {
            fetchRegistros(); 
        }
    };

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registro de Solicitudes</h1>
                </div>
                <RegistrosTable
                    data={solicitudesFiltradas}
                    onAccept={handleAcceptRegistro}
                    onReject={handleRejectRegistro}
                />
            </div>
        </div>
    );
};

export default RegistroSolicitudes;
