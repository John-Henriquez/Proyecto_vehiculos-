import Form from './Form';
import { useEffect, useState } from 'react';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { getDisponibilidad } from '../services/asignacion.service';

export default function AcceptPopup({ show, setShow, data, action, vehiculos, conductores }) {
    const solicitudData = data && data.length > 0 ? data[0] : {};

    const [conductoresDisponibles, setConductoresDisponibles] = useState([]);

    const [availability, setAvailability] = useState({
        availableVehiculos: [],
        availableConductores: [],
        unavailableVehiculos: [],
        unavailableConductores: [],
    });

    const vehiculosFiltrados = vehiculos.filter(
        vehiculo => vehiculo.id_tipo_vehiculo === data.id_tipo_vehiculo
    );

    const formatDate = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    const validateAvailability = async () => {
        const { fechaSalida, fecha_regreso } = data;
        
        const formattedFechaSalida = formatDate(fechaSalida);
        const formattedFechaRegreso = formatDate(fecha_regreso);

        if (!fechaSalida || !fecha_regreso) {
            console.error("Fecha de salida o fecha de regreso no definidas:", solicitudData);
            return;
        }


        try {
            const result = await getDisponibilidad(formattedFechaSalida, formattedFechaRegreso);

            setAvailability(result);
        } catch (error) {
            console.log("Error al obtener la disponibilidad:", error);
        }
    };

    useEffect(() => {
        if (show) {
            validateAvailability();
            console.log("data", data);
        }
    }, [show]);

    const handleSubmit = (formData) => {
        action(formData);
    };

    const isConductorAvailable = (conductorRut) => {
        return availability.availableConductores && availability.availableConductores.includes(conductorRut);
    };

    const isVehiculoAvailable = (vehiculoPlaca) => {
        return availability.availableVehiculos && availability.availableVehiculos.includes(vehiculoPlaca);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
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
                                    label: 'Conductor',
                                    name: 'rut_conductor',
                                    fieldType: 'select',
                                    options: conductores.map(conductor => ({
                                        value: conductor.rut_conductor,
                                        label: `${conductor.nombre} - ${conductor.rut_conductor}`,
                                        disabled: !isConductorAvailable(conductor.rut_conductor),
                                        style: {
                                            color: isConductorAvailable(conductor.rut_conductor) ? 'black' : 'red',
                                        }
                                    })),
                                    required: true,
                                    defaultValue: '',
                                },
                                {
                                    label: 'Vehículo',
                                    name: 'placa_vehiculo',
                                    fieldType: 'select',
                                    options: vehiculosFiltrados.map(vehiculo => ({
                                        value: vehiculo.placa,
                                        label: `${vehiculo.marca} - ${vehiculo.modelo} - ${vehiculo.placa}`,
                                        disabled: !isVehiculoAvailable(vehiculo.placa),
                                        style: {
                                            color: isVehiculoAvailable(vehiculo.placa) ? 'black' : 'red',
                                        }
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
