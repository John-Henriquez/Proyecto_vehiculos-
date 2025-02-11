import { useState } from 'react';
import { updateRegistro } from '@services/registro.service.js'; // Asegúrate de que la ruta sea correcta
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditRegistro = (fetchRegistros, setRegistros) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataRegistro, setDataRegistro] = useState({});

  const handleClickUpdate = (registro) => {
    if (registro && registro.id_registro) {
      setDataRegistro(registro);
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedRegistroData) => {
    if (!updatedRegistroData?.id_registro) {
      showErrorAlert('Error', 'Falta el ID del registro.');
      return;
    }

    try {
      const updatedRegistro = await updateRegistro(updatedRegistroData.id_registro, updatedRegistroData);

      showSuccessAlert('¡Actualizado!', 'El registro ha sido actualizado correctamente.');
      setIsPopupOpen(false);

      // Actualiza el estado local
      setRegistros((prevRegistros) =>
        prevRegistros.map((registro) =>
          registro.id_registro === updatedRegistro.id_registro ? { ...updatedRegistro } : registro
        )
      );

      // Refresca la lista completa
      await fetchRegistros();
      setDataRegistro({});
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      showErrorAlert('Error', `No se pudo actualizar el registro: ${error.message}`);
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataRegistro,
    setDataRegistro,
  };
};

export default useEditRegistro;
