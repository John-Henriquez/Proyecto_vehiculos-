import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupVehiculo({ show, setShow, data, action }) {
    const isEditing = !!data;
    const vehiculoData = data || {};

    const handleSubmit = (formData) => {
        action({
            ...formData,
            placa: isEditing ? vehiculoData.placa : formData.placa, 
        });
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
                            title={isEditing ? "Editar vehículo" : "Agregar nuevo vehículo"}
                            fields={[
                            {
                                label: "Placa",
                                name: "placa",
                                defaultValue: vehiculoData.placa || "",
                                placeholder: 'ABC123-4',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                disabled: isEditing, 
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
                        buttonText={isEditing ? "Editar vehículo" : "Agregar vehículo"}
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
