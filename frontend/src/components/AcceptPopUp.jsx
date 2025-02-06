import Form from './Form';
import { useEffect, useState } from 'react';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { getDisponibilidad } from '../services/asignacion.service';

export default function AcceptPopup({ show, setShow, data, action, vehiculos, conductores }) {
    const solicitudData = data && data.length > 0 ? data[0] : {};
    const [availability, setAvailability] = useState({
        availableVehiculos: [],
        availableConductores: [],
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
        
        if (!fechaSalida || !fecha_regreso) {
            console.error("Fecha de salida o fecha de regreso no definidas:", solicitudData);
            return;
        }

        const formattedFechaSalida = formatDate(fechaSalida);
        const formattedFechaRegreso = formatDate(fecha_regreso);

        try {
            const result = await getDisponibilidad(formattedFechaSalida, formattedFechaRegreso);
            console.log("Disponibilidad obtenida:", result);
            setAvailability({
                availableVehiculos: result.data.vehiculosDisponibles,
                availableConductores: result.data.conductoresDisponibles,
            });
            
        } catch (error) {
            console.log("Error al obtener la disponibilidad:", error);
        }
    };

    useEffect(() => {
        if (show) {
            validateAvailability();
            console.log("Datos de la solicitud:", data);
        }
    }, [show]);

    const isConductorAvailable = (conductorRut) => {
        return Array.isArray(availability.availableConductores) &&
            availability.availableConductores.some(conductor => conductor.rut === conductorRut); // Asegúrate de que 'rut' sea el campo correcto
    };
    
    const isVehiculoAvailable = (vehiculoPlaca) => {
        return Array.isArray(availability.availableVehiculos) &&
            availability.availableVehiculos.some(vehiculo => vehiculo.placa === vehiculoPlaca); // Asegúrate de que 'placa' sea el campo correcto
    };
    

    const filteredConductores = Array.isArray(availability.availableConductores)
    ? availability.availableConductores.map(conductor => ({
        value: conductor.rut_conductor,
        label: `${conductor.nombre} - ${conductor.rut_conductor}`,
    }))
    : [];

    console.log("Conductores disponibles para dropdown:", filteredConductores);

    const filteredVehiculos = vehiculosFiltrados
    .filter(vehiculo => vehiculo && isVehiculoAvailable(vehiculo.placa))
    .map(vehiculo => ({
        value: vehiculo.placa,
        label: `${vehiculo.marca} - ${vehiculo.modelo} - ${vehiculo.placa}`,
    }));

    console.log("Vehículos disponibles para dropdown:", filteredVehiculos);

    const handleSubmit = (formData) => {
        action(formData);
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
                                    options: filteredConductores,
                                    required: true,
                                    defaultValue: '',
                                },
                                {
                                    label: 'Vehículo',
                                    name: 'placa_vehiculo',
                                    fieldType: 'select',
                                    options: filteredVehiculos,
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
