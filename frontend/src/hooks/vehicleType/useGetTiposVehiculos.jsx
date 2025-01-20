// src/hooks/useGetTiposVehiculos.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetTiposVehiculos = () => {
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTiposVehiculos = async () => {
      try {
        const response = await axios.get('/api/tipos-vehiculos');  
        setTiposVehiculos(response.data);  
      } catch (error) {
        setError('Error al obtener los tipos de vehículos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiposVehiculos();
  }, []); 

  return { tiposVehiculos, loading, error };
};

export default useGetTiposVehiculos;
