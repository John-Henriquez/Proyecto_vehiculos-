import { useState } from 'react';
import { createSolicitud } from '../services/solicitudes.service';
import '../styles/crearSolicitud.css'; 

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function VehicleRequestForm() {
  const [formData, setFormData] = useState({
    fechaSalida: '',
    nombreAgrupacion: '',
    numTelefono: '',
    fechaSolicitud: new Date().toISOString().split('T')[0], // Fecha actual
    destino: '',
    placaPatente: '',
    observaciones: '',
    prioridad: 'alta',
    rutConductor: ''
  });

  const [errors, setErrors] = useState({
    fechaSalida: '',
    nombreAgrupacion: '',
    numTelefono: '',
    destino: '',
    placaPatente: '',
    rutConductor: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validación de campos
    if (!formData.fechaSalida) {
      newErrors.fechaSalida = 'Fecha de salida es requerida';
      valid = false;
    }

    if (!formData.nombreAgrupacion) {
      newErrors.nombreAgrupacion = 'Nombre de la agrupación es requerido';
      valid = false;
    }

    if (!formData.numTelefono) {
      newErrors.numTelefono = 'Número de teléfono es requerido';
      valid = false;
    }

    if (!formData.destino) {
      newErrors.destino = 'Destino es requerido';
      valid = false;
    }

    if (!formData.placaPatente) {
      newErrors.placaPatente = 'Placa del vehículo es requerida';
      valid = false;
    }

    if (!formData.rutConductor) {
      newErrors.rutConductor = 'RUT del conductor es requerido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const formattedDate = formatDate(formData.fechaSalida);

        const finalFormData = {
          fecha_salida: formattedDate,
          nombre_agrupacion: formData.nombreAgrupacion,
          num_telefono: formData.numTelefono,
          fecha_solicitud: formData.fechaSolicitud,
          destino: formData.destino,
          placa_patente: formData.placaPatente,
          observaciones: formData.observaciones,
          prioridad: formData.prioridad,
          rut_conductor: formData.rutConductor
        };
        const response = await createSolicitud(finalFormData);
        console.log("Respuesta del servidor:", response);

        

        if (response?.success === true) {
          setSuccessMessage('Solicitud creada exitosamente');
          setErrorMessage('');
        } else {
          setErrorMessage(response.message || 'Error al crear la solicitud');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error al crear la solicitud');
      }
    } else {
      setErrorMessage('Por favor, corrija los errores en el formulario.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Formulario de Solicitud de Vehículo</h2>
      
      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="alert success">
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="alert error">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          {/* Fecha de salida */}
          <div className="form-group">
            <label htmlFor="fechaSalida">Fecha de salida</label>
            <input
              id="fechaSalida"
              name="fechaSalida"
              type="date"
              value={formData.fechaSalida}
              onChange={handleChange}
              className={`input ${errors.fechaSalida ? 'error' : ''}`}
            />
            {errors.fechaSalida && <p className="error-message">{errors.fechaSalida}</p>}
          </div>

          {/* Nombre de la agrupación */}
          <div className="form-group">
            <label htmlFor="nombreAgrupacion">Nombre de la agrupación</label>
            <input
              id="nombreAgrupacion"
              name="nombreAgrupacion"
              value={formData.nombreAgrupacion}
              onChange={handleChange}
              className={`input ${errors.nombreAgrupacion ? 'error' : ''}`}
              placeholder="Nombre de la agrupación"
            />
            {errors.nombreAgrupacion && <p className="error-message">{errors.nombreAgrupacion}</p>}
          </div>

          {/* Número de teléfono */}
          <div className="form-group">
            <label htmlFor="numTelefono">Número de teléfono</label>
            <input
              id="numTelefono"
              name="numTelefono"
              type="tel"
              value={formData.numTelefono}
              onChange={handleChange}
              className={`input ${errors.numTelefono ? 'error' : ''}`}
              placeholder="Número de teléfono"
            />
            {errors.numTelefono && <p className="error-message">{errors.numTelefono}</p>}
          </div>

          {/* Destino */}
          <div className="form-group">
            <label htmlFor="destino">Destino</label>
            <input
              id="destino"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              className={`input ${errors.destino ? 'error' : ''}`}
              placeholder="Destino"
            />
            {errors.destino && <p className="error-message">{errors.destino}</p>}
          </div>

          {/* Placa del vehículo */}
          <div className="form-group">
            <label htmlFor="placaPatente">Placa del vehículo</label>
            <input
              id="placaPatente"
              name="placaPatente"
              value={formData.placaPatente}
              onChange={handleChange}
              className={`input ${errors.placaPatente ? 'error' : ''}`}
              placeholder="Placa del vehículo"
            />
            {errors.placaPatente && <p className="error-message">{errors.placaPatente}</p>}
          </div>

          {/* RUT del conductor */}
          <div className="form-group">
            <label htmlFor="rutConductor">RUT del conductor</label>
            <input
              id="rutConductor"
              name="rutConductor"
              value={formData.rutConductor}
              onChange={handleChange}
              className={`input ${errors.rutConductor ? 'error' : ''}`}
              placeholder="RUT del conductor"
            />
            {errors.rutConductor && <p className="error-message">{errors.rutConductor}</p>}
          </div>

          {/* Observaciones */}
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="input"
              placeholder="Observaciones adicionales"
            />
          </div>

        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="submit-button"
        >
          Crear Solicitud
        </button>
      </form>
    </div>
  );
}
