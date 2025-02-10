import React from 'react';
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos';

export default function EditPopup({ show, setShow, data, action }) {
  const { tiposVehiculos } = useGetTiposVehiculos();
  const solicitudData = data || {};
  console.log("Datos de la solicitud:", data);


  const tipoVehiculoOptions = tiposVehiculos?.map(tipo => ({
    value: tipo.id_tipo_vehiculo,
    label: tipo.nombre
  })) || [];

  const handleSubmit = async (formData) => {
    try {
      await action(formData);
      setShow(false);
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
              title="Editar Solicitud"
              fields={[
                {
                  label: "Nombre Agrupación",
                  name: "nombre_agrupacion",
                  defaultValue: solicitudData.nombre_agrupacion || "",
                  placeholder: 'Nombre de la agrupación',
                  fieldType: 'input',
                  type: "text",
                  required: true,
                },
                {
                  label: "Teléfono",
                  name: "numero_telefono",
                  defaultValue: solicitudData.numero_telefono || "",
                  placeholder: '+56912345678',
                  fieldType: 'input',
                  type: "tel",
                  required: true,
                },
                {
                  label: "Fecha Salida",
                  name: "fechaSalida",
                  defaultValue: solicitudData.fechaSalida?.split('T')[0] || "",
                  fieldType: 'input',
                  type: "date",
                  required: true,
                },
                {
                  label: "Fecha Llegada",
                  name: "fecha_regreso",
                  defaultValue: solicitudData.fecha_regreso?.split('T')[0] || "",
                  fieldType: 'input',
                  type: "date",
                  required: true,
                },
                {
                  label: "Destino",
                  name: "destino",
                  defaultValue: solicitudData.destino || "",
                  placeholder: 'Destino del viaje',
                  fieldType: 'input',
                  type: "text",
                  required: true,
                },
                {
                  label: "Tipo Vehículo",
                  name: "id_tipo_vehiculo",
                  fieldType: 'select',
                  options: tipoVehiculoOptions,
                  required: true,
                  defaultValue: solicitudData.id_tipo_vehiculo || "",
                },
                {
                  label: "Pasajeros",
                  name: "cantidad_pasajeros",
                  defaultValue: solicitudData.cantidad_pasajeros || "",
                  placeholder: 'Número de pasajeros',
                  fieldType: 'input',
                  type: "number",
                  required: true,
                },
              ]}
              onSubmit={handleSubmit}
              buttonText="Guardar Cambios"
              backgroundColor={'#fff'}
            />
          </div>
        </div>
      )}
    </div>
  );
}