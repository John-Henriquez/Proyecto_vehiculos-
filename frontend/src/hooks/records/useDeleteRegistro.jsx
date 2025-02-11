import { useState } from "react";
import { deleteRegistro } from "@services/registro.service.js";
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useDeleteRegistro = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRegistroById = async (id_registro) => {
    if (!id_registro) {
      showErrorAlert("Error", "No se seleccionó ningún registro para eliminar.");
      return;
    }

    try {
      const result = await deleteDataAlert(); // Confirmación de eliminación
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);

        const response = await deleteRegistro(id_registro);

        if (response.error) {
          setError(response.error);
          showErrorAlert("Error", response.error);
        } else {
          showSuccessAlert("¡Eliminado!", "El registro ha sido eliminado correctamente.");
          if (onSuccess) onSuccess(); // Actualiza la lista
        }
      } else {
        showErrorAlert("Cancelado", "La operación fue cancelada.");
      }
    } catch (err) {
      setError("No se pudo eliminar el registro");
      showErrorAlert("Error", "No se pudo eliminar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRegistroById, loading, error };
};

export default useDeleteRegistro;
