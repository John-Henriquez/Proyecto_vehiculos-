import { useState, useEffect } from 'react';
import { createSolicitud } from '../services/solicitudes.service';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos';
import '../styles/crearSolicitud.css'; 

const formatDate = (date) => {
  if (!date || !date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)) {
    return date; 
  }
  const [day, month, year] = date.split("/");  
  return `${year}-${month}-${day}`;  
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
    rutSolicitante: '',
    fechaRegreso: '',
    idTipoVehiculo: '',
  });

  const [errors, setErrors] = useState({
    fechaSalida: '',
    nombreAgrupacion: '',
    numTelefono: '',
    destino: '',
    rutSolicitante: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { tiposVehiculos } = useGetTiposVehiculos();

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    // Validación de campos
    if (!formData.rutSolicitante) {
      newErrors.rutSolicitante = 'RUT del solicitante es requerido';
      valid = false;
    }
    
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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      if (!isValidDate(formData.fechaSalida) || !isValidDate(formData.fechaRegreso)) {
        setErrorMessage('Las fechas deben tener el formato dd/mm/yyyy');
        return;
      }
      try {
        const formattedFechaSalida = formatDate(formData.fechaSalida); // Formateamos la fecha
      const formattedFechaRegreso = formatDate(formData.fechaRegreso);

        const finalFormData = {
          fecha_salida: formattedDate,
          nombre_agrupacion: formData.nombreAgrupacion,
          numero_telefono: formData.numTelefono, // Cambiado a "numero_telefono"
          fecha_solicitud: formData.fechaSolicitud,
          destino: formData.destino,
          observaciones: formData.observaciones,
          prioridad: formData.prioridad,
          rut_solicitante: formData.rutSolicitante,
          fecha_regreso: formData.fechaRegreso,
          id_tipo_vehiculo: Number(formData.idTipoVehiculo), // Convertir a número
          placa_patente: formData.placaPatente || "", // Incluyendo si está vacío
          rut_conductor: formData.rutConductor || "", // Incluyendo si está vacío
          estado: 'pendiente',
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

          {/* RUT del solicitante */}
          <div className="form-group">
            <label htmlFor="rutSolicitante">RUT del solicitante</label>
            <input
              id="rutSolicitante"
              name="rutSolicitante"
              value={formData.rutSolicitante}
              onChange={handleChange}
              className={`input ${errors.rutSolicitante ? 'error' : ''}`}
              placeholder="RUT del solicitante"
            />
            {errors.rutSolicitante && <p className="error-message">{errors.rutSolicitante}</p>}
          </div>

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
           {/* Fecha de regreso */}
           <div className="form-group">
            <label htmlFor="fechaRegreso">Fecha de regreso</label>
            <input
              id="fechaRegreso"
              name="fechaRegreso"
              type="date"
              value={formData.fechaRegreso}
              onChange={handleChange}
              className="input"
            />
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

          {/* Tipo de vehículo */}  
          <div className="form-group">
            <label htmlFor="idTipoVehiculo">Tipo de vehículo</label>
            <select
              id="idTipoVehiculo"
              name="idTipoVehiculo"
              value={formData.idTipoVehiculo}
              onChange={handleChange}
              className="input"
              >
              {tiposVehiculos.length === 0 ? (
                <option value="">Cargando tipos de vehículos...</option>
              ) : (
                tiposVehiculos.map((tipo) => (
                  <option key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
                    {tipo.nombre}
                  </option>
                ))
              )}
            </select>
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
