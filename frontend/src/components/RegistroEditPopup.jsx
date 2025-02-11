import React, { useState, useEffect } from 'react';
import '@styles/popup_registro.css';
import CloseIcon from '@assets/XIcon.svg';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fecha_salida) {
        alert("La fecha de salida es obligatoria.");
        return;
      }
      
    try {
      await onUpdate(formData);
      setShow(false);
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  };

  return show ? (
    <div className="bg">
      <div className="popup">
        <button className="close" onClick={() => setShow(false)}>
          <img src={CloseIcon} alt="Cerrar" />
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Editar Registro</h2>

          <div className="form-group">
            <label>Nombre Agrupación</label>
            <input
              type="text"
              name="nombre_agrupacion"
              value={formData.nombre_agrupacion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Número Teléfono</label>
            <input
              type="tel"
              name="num_telefono"
              value={formData.num_telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha Salida</label>
            <input
              type="date"
              name="fecha_salida"
              value={formData.fecha_salida}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha Regreso</label>
            <input
              type="date"
              name="fecha_regreso"
              value={formData.fecha_regreso}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Destino</label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>

          {formData.estado === 'aceptada' && (
            <>
              <div className="form-group">
                <label>Placa Vehículo</label>
                <input
                  type="text"
                  name="placa_vehiculo"
                  value={formData.placa_vehiculo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>RUT Conductor</label>
                <input
                  type="text"
                  name="rut_conductor"
                  value={formData.rut_conductor}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
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
