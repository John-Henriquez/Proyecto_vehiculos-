import { useState, useEffect } from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function AcceptPopup({ show, setShow, data, action, vehiculos }) {
    const solicitudData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} />
                        </button>
                        <Form
                            title="Aceptar Solicitud"
                            fields={[
                                {
                                    label: 'Estado',
                                    name: 'estado',
                                    defaultValue: 'aceptada',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    disabled: true,
                                },
                                {
                                    label: 'Observaciones',
                                    name: 'observaciones',
                                    defaultValue: solicitudData.observaciones || '',
                                    placeholder: 'Escribe las observaciones aquí...',
                                    fieldType: 'textarea',
                                    required: false,
                                },
                                {
                                    label: 'RUT del Conductor',
                                    name: 'rutConductor',
                                    defaultValue: solicitudData.rut_conductor || '',
                                    placeholder: 'Escribe el RUT del conductor...',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                },
                                {
                                    label: 'Vehículo',
                                    name: 'placaPatente',
                                    fieldType: 'select',
                                    options: vehiculos.map(vehiculo => ({
                                        value: vehiculo.placa,
                                        label: `${vehiculo.placa} - ${vehiculo.capacidad_maxima}`
                                    })),
                                    required: true,
                                    defaultValue: '', 
                                }
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Aceptar Solicitud"
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
