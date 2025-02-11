import React, { useState, useEffect } from 'react';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { getDisponibilidad } from '../services/asignacion.service';

export default function RegistroEditPopup({ show, setShow, data, onUpdate }) {
  const [formData, setFormData] = useState({
    id_registro: '',
    nombre_agrupacion: '',
    num_telefono: '',
    fecha_salida: '',
    fecha_regreso: '',
    destino: '',
    placa_vehiculo: '',
    rut_conductor: '',
    estado: '',
    observaciones: '',
  });
  const [availability, setAvailability] = useState({
    availableVehiculos: [],
    availableConductores: [],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        id_registro: data.id_registro || '',
        nombre_agrupacion: data.nombre_agrupacion || '',
        num_telefono: data.num_telefono || '',
        fecha_salida: data.fecha_salida?.split('T')[0] || '',
        fecha_regreso: data.fecha_regreso?.split('T')[0] || '',
        destino: data.destino || '',
        placa_vehiculo: data.placa_vehiculo || '',
        rut_conductor: data.rut_conductor || '',
        estado: data.estado || '',
        observaciones: data.observaciones || '',
      });
    }
  }, [data]);

  useEffect(() => {
    if (show && formData.fecha_salida && formData.fecha_regreso) {
      console.log('useEffect ejecutando validateAvailability');
      validateAvailability();
    }
  }, [show, formData.fecha_salida, formData.fecha_regreso]);
  console.log('Fecha de salida:', formData.fecha_salida);
  console.log('Fecha de regreso:', formData.fecha_regreso);

  

  const validateAvailability = async () => {
    console.log('validateAvailability se está ejecutando');
    const fechaRegreso = formData.fecha_regreso || formData.fecha_salida;
    try {
      const result = await getDisponibilidad(formData.fecha_salida, formData.fecha_regreso);
      console.log('Resultado de disponibilidad:', result);
      setAvailability({
        availableVehiculos: result.data.vehiculosDisponibles || [],
        availableConductores: result.data.conductoresDisponibles || [],
      });
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fecha_salida) {
      alert('La fecha de salida es obligatoria.');
      return;
    }
    try {
      await onUpdate(formData);
      setShow(false);
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  };


  const filteredConductores = availability.availableConductores.map(conductor => ({
    value: conductor.rut_conductor,
    label: `${conductor.nombre} - ${conductor.rut_conductor}`,
  }));

  const filteredVehiculos = availability.availableVehiculos.map(vehiculo => ({
    value: vehiculo.placa,
    label: `${vehiculo.marca} - ${vehiculo.modelo} - ${vehiculo.placa}`,
  }));

  return show ? (
    <div className="bg">
      <div className="popup">
        <button className="close" onClick={() => setShow(false)}>
          <img src={CloseIcon} alt="Cerrar" />
        </button>
        <h2 className="title">Editar Registro</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="container_inputs">
             {/* NOmbre agrupacion */}
            <label>Nombre Agrupación</label>
            <input
              type="text"
              name="nombre_agrupacion"
              value={formData.nombre_agrupacion}
              onChange={handleChange}
              required
            />
          </div>
          {/* Numero telefono */}
          <div className="container_inputs">
            <label>Número Teléfono</label>
            <input
              type="tel"
              name="num_telefono"
              value={formData.num_telefono}
              onChange={handleChange}
              required
            />
          </div>
          {/* Fecha salida */}
          <div className="container_inputs">
            <label>Fecha Salida</label>
            <input
              type="date"
              name="fecha_salida"
              value={formData.fecha_salida}
              onChange={handleChange}
              required
            />
          </div>
          {/* Fecha regreso */}
          <div className="container_inputs">
            <label>Fecha Regreso</label>
            <input
              type="date"
              name="fecha_regreso"
              value={formData.fecha_regreso}
              onChange={handleChange}
            />
          </div>
          {/* Destino */}
          <div className="container_inputs">
            <label>Destino</label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              required
            />
          </div>
          {/* Estado */}
          <div className="container_inputs">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
          {formData.estado === 'aceptada' && (
            <>
              <div className="container_inputs">
                <label>Placa Vehículo</label>
                <select
                  name="placa_vehiculo"
                  value={formData.placa_vehiculo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un vehículo</option>
                  {filteredVehiculos.map(vehiculo => (
                    <option key={vehiculo.value} value={vehiculo.value}>
                      {vehiculo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="container_inputs">
                <label>RUT Conductor</label>
                <select
                  name="rut_conductor"
                  value={formData.rut_conductor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un conductor</option>
                  {filteredConductores.map(conductor => (
                    <option key={conductor.value} value={conductor.value}>
                      {conductor.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="container_inputs">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-save">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
