import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '@styles/popup-enhanced.css';
import CloseIcon from '@assets/XIcon.svg';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos';
import useEditTipoVehiculo from '../hooks/vehicleType/useEditTipoVehiculo';
import useDeleteTipoVehiculo from '../hooks/vehicleType/useDeleteTipoVehiculo';

export default function PopupTipoVehiculo({ show, setShow }) {
    const { tiposVehiculos, fetchTipoVehiculo } = useGetTiposVehiculos();
    const { handleEditTipoVehiculo } = useEditTipoVehiculo(fetchTipoVehiculo);
    const { handleDeleteTipoVehiculo } = useDeleteTipoVehiculo(fetchTipoVehiculo);

    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (show) {
            fetchTipoVehiculo(); // Refrescar la lista de tipos de vehículos al abrir el popup
        }
    }, [show, fetchTipoVehiculo]);

    const handleEdit = (tipoVehiculo) => {
        setEditData(tipoVehiculo);
    };

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        if (confirmResult.isConfirmed) {
            await handleDeleteTipoVehiculo(id);
            Swal.fire({
                title: 'Eliminado',
                text: 'El tipo de vehículo ha sido eliminado correctamente.',
                icon: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                fetchTipoVehiculo(); 
            });
        }
    };

    return (
        show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <h2>Gestión de Tipos de Vehículo</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposVehiculos.map((tipo) => (
                                <tr key={tipo.id_tipo_vehiculo}>
                                    <td>{tipo.id_tipo_vehiculo}</td>
                                    <td>{tipo.nombre}</td>
                                    <td>{tipo.categoria}</td>
                                    <td>
                                        <button onClick={() => handleEdit(tipo)} className="btn-edit">Editar</button>
                                        <button onClick={() => handleDelete(tipo.id_tipo_vehiculo)} className="btn-delete">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    );
}
