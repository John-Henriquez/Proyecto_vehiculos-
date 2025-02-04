import React from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupConductor({ show, setShow, data, action, loading }) {
    const isEditing = !!data;
    const conductorData = data || {};

    const handleSubmit = async (formData) => {
        try {
            await action(formData);
            setShow(false); // Cierra el popup después de completar la acción
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
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
                            title={isEditing ? "Editar Conductor" : "Agregar Nuevo Conductor"}
                            fields={[
                                {
                                    label: "RUT Conductor",
                                    name: "rut_conductor",
                                    defaultValue: conductorData.rut_conductor || "",
                                    placeholder: '12.345.678-9',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                    disabled: isEditing,
                                },
                                {
                                    label: "Nombre",
                                    name: "nombre",
                                    defaultValue: conductorData.nombre || "",
                                    placeholder: 'Nombre completo',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Teléfono",
                                    name: "telefono",
                                    defaultValue: conductorData.telefono || "",
                                    placeholder: '+56912345678',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Estado",
                                    name: "estado",
                                    fieldType: 'select',
                                    options: [
                                        { value: 'Disponible', label: 'Disponible' },
                                        { value: 'ocupado', label: 'Ocupado' },
                                        { value: 'no disponible', label: 'No Disponible' },
                                    ],
                                    required: true,
                                    defaultValue: conductorData.estado || "Disponible",
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEditing ? "Editar Conductor" : "Agregar Conductor"}
                            backgroundColor={'#fff'}
                            loading={loading} // Muestra el estado de carga en el botón
                        />
                    </div>
                </div>
            )}
        </div>
    );
}