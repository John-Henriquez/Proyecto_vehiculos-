import { useState } from 'react';

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
        // Llamada al servicio para crear la solicitud
        // await createSolicitud(formData);
        setSuccessMessage('Solicitud creada exitosamente');
        setErrorMessage('');
        setFormData({
          fechaSalida: '',
          nombreAgrupacion: '',
          numTelefono: '',
          fechaSolicitud: new Date().toISOString().split('T')[0],
          destino: '',
          placaPatente: '',
          observaciones: '',
          prioridad: 'alta',
          rutConductor: ''
        });
      } catch (error) {
        setErrorMessage('Error al crear la solicitud');
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
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl my-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Formulario de Solicitud de Vehículo</h2>
      
      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Fecha de salida */}
          <div>
            <label htmlFor="fechaSalida" className="block text-sm font-medium text-gray-700">Fecha de salida</label>
            <input
              id="fechaSalida"
              name="fechaSalida"
              type="date"
              value={formData.fechaSalida}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.fechaSalida ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fechaSalida && <p className="mt-2 text-sm text-red-600">{errors.fechaSalida}</p>}
          </div>

          {/* Nombre de la agrupación */}
          <div>
            <label htmlFor="nombreAgrupacion" className="block text-sm font-medium text-gray-700">Nombre de la agrupación</label>
            <input
              id="nombreAgrupacion"
              name="nombreAgrupacion"
              value={formData.nombreAgrupacion}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.nombreAgrupacion ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre de la agrupación"
            />
            {errors.nombreAgrupacion && <p className="mt-2 text-sm text-red-600">{errors.nombreAgrupacion}</p>}
          </div>

          {/* Número de teléfono */}
          <div>
            <label htmlFor="numTelefono" className="block text-sm font-medium text-gray-700">Número de teléfono</label>
            <input
              id="numTelefono"
              name="numTelefono"
              type="tel"
              value={formData.numTelefono}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.numTelefono ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Número de teléfono"
            />
            {errors.numTelefono && <p className="mt-2 text-sm text-red-600">{errors.numTelefono}</p>}
          </div>

          {/* Destino */}
          <div>
            <label htmlFor="destino" className="block text-sm font-medium text-gray-700">Destino</label>
            <input
              id="destino"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.destino ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Destino"
            />
            {errors.destino && <p className="mt-2 text-sm text-red-600">{errors.destino}</p>}
          </div>

          {/* Placa del vehículo */}
          <div>
            <label htmlFor="placaPatente" className="block text-sm font-medium text-gray-700">Placa del vehículo</label>
            <input
              id="placaPatente"
              name="placaPatente"
              value={formData.placaPatente}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.placaPatente ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Placa del vehículo"
            />
            {errors.placaPatente && <p className="mt-2 text-sm text-red-600">{errors.placaPatente}</p>}
          </div>

          {/* RUT del conductor */}
          <div>
            <label htmlFor="rutConductor" className="block text-sm font-medium text-gray-700">RUT del conductor</label>
            <input
              id="rutConductor"
              name="rutConductor"
              value={formData.rutConductor}
              onChange={handleChange}
              className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.rutConductor ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="RUT del conductor"
            />
            {errors.rutConductor && <p className="mt-2 text-sm text-red-600">{errors.rutConductor}</p>}
          </div>

          {/* Observaciones */}
          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Observaciones adicionales"
            />
          </div>

        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear Solicitud
        </button>
      </form>
    </div>
  );
}
