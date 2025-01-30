import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupVehiculo({ show, setShow, data, action }) {
    const vehiculoData = data || {};

    const handleSubmit = (formData) => {
        action({
            ...formData,
            placa: vehiculoData.placa 
        });
    };

    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <input 
                        type="hidden" 
                        name="placa" 
                        value={vehiculoData.placa || ""} 
                    />
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <Form
                        title="Editar vehículo"
                        fields={[
                            {
                                label: "Placa",
                                name: "placa",
                                defaultValue: vehiculoData.placa || "",
                                placeholder: 'ABC123-4',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                disabled: true,
                            },
                            {
                                label: "Marca",
                                name: "marca",
                                defaultValue: vehiculoData.marca || "",
                                placeholder: 'Toyota, Mercedes Benz...',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                            },
                            {
                                label: "Modelo",
                                name: "modelo",
                                defaultValue: vehiculoData.modelo || "",
                                placeholder: 'Modelo del vehículo',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                            },
                            {
                                label: "Capacidad Máxima",
                                name: "capacidad_maxima",
                                defaultValue: vehiculoData.capacidad_maxima || "",
                                placeholder: 'Número de pasajeros',
                                fieldType: 'input',
                                type: "number",
                                required: true,
                                min: 1,
                            },
                            {
                                label: "Estado",
                                name: "estado",
                                fieldType: 'select',
                                options: [
                                    { value: 'Disponible', label: 'Disponible' },
                                    { value: 'En mantenimiento', label: 'En mantenimiento' },
                                    { value: 'Fuera de servicio', label: 'Fuera de servicio' },
                                ],
                                required: true,
                                defaultValue: vehiculoData.estado || "Disponible",
                            },
                            {
                                label: "Tipo de Vehículo",
                                name: "id_tipo_vehiculo",
                                defaultValue: vehiculoData.id_tipo_vehiculo || "",
                                placeholder: 'ID del tipo de vehículo',
                                fieldType: 'input',
                                type: "number",
                                required: true,
                            },
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar vehículo"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
