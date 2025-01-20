import SolicitudesTable from '../components/SolicitudesTable.jsx';
import Search from '../components/Search.jsx';
<<<<<<< HEAD
import Popup from '../components/Popup.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import { useCallback, useState } from 'react';
import useEditSolicitud from '../hooks/applications/useEditSolicitud.jsx';
import useDeleteSolicitud from '../hooks/applications/useDeleteSolicitud.jsx';
=======
import {  useState,useEffect } from 'react';
import { getAllSolicitudes, acceptSolicitud, rejectSolicitud } from '../services/solicitudes.service.js';
import useGetConductores  from '../hooks/drivers/useGetConductores.jsx';
>>>>>>> f52907f (vista y backend funcional - parcial)

const Solicitudes = () => {
    const { conductores } = useGetConductores();
    const [solicitudes, setSolicitudes] = useState([]);
    const [filterId, setFilterId] = useState('');

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const fetchSolicitudes = await getAllSolicitudes();
            setSolicitudes(fetchSolicitudes);
        };
        fetchSolicitudes();
    }, []);
     const handleAccept = async (id) => {
        const updatedSolicitud = await acceptSolicitud(id);
        setSolicitudes((prev) => 
            prev.map((solicitud) =>
                solicitud.id_solicitud === id ? { ...solicitud, estado: updatedSolicitud.estado } : solicitud
            )
        );
     };

    const handleReject = async (id) => {
        const updatedSolicitud = await rejectSolicitud(id);
        setSolicitudes((prev) => 
            prev.map((solicitud) =>
                solicitud.id_solicitud === id ? { ...solicitud, estado: updatedSolicitud.estado } : solicitud
            )
        );
    };

    const solicitudesConNombreConductor = solicitudes.map(solicitud => {
        const rutSolicitud = solicitud.rut_conductor.replace(/[^\d-]+/g, "");  
        const conductor = conductores.find(conductor => conductor.rut_conductor === rutSolicitud);

        return {
            ...solicitud,
            nombre_conductor: conductor && conductor.nombre ? conductor.nombre : 'Desconocido', 
        };
    });

    const filteredSolicitudes = solicitudesConNombreConductor.filter((solicitud) =>
        solicitud.id_solicitud.toString().includes(filterId)
    ); 

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de solicitud'/>
                    </div>
                </div>
                <SolicitudesTable
                    data={filteredSolicitudes}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            </div>
        </div>
    );
};

export default Solicitudes;

