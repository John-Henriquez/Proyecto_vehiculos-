import React, { useState } from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import useCreateTipoVehiculo from '../hooks/vehicleType/useCreateTipoVehiculo';

export default function PopupCategoria({ show, setShow, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: ''
    });

    const { handleCreateTipoVehiculo, isLoading } = useCreateTipoVehiculo(onSuccess);

    const handleSubmit = async (data) => {
        if (!data.nombre.trim() || !data.categoria.trim()) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        try {
            await handleCreateTipoVehiculo(data);
            setShow(false);
        } catch (error) {
            console.error("Error al crear categoría:", error);
        }
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className='close' onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title="Agregar Nueva Categoría"
                            fields={[
                                {
                                    label: "Nombre",
                                    name: "nombre",
                                    defaultValue: formData.nombre,
                                    placeholder: 'Ingrese el nombre de la categoría',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Categoría",
                                    name: "categoria",
                                    defaultValue: formData.categoria,
                                    placeholder: 'Ingrese la categoría del vehículo',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isLoading ? "Guardando..." : "Guardar"}
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
