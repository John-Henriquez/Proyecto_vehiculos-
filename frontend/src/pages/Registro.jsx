import RegistrosTable from '../components/RegistroTable.jsx';
import Search from '../components/Search.jsx';
import { useState, useEffect } from 'react';
import useGetTiposVehiculos from '../hooks/vehicleType/useGetTiposVehiculos.jsx';
import FiltroVehiculo from '../components/FiltroVehiculo.jsx';  
import { getAllRegistros } from '../services/registro.service.js';
import useGetConductores from '../hooks/drivers/useGetConductores.jsx';
import axios from '../services/root.service.js';
import logo from '../assets/logo_muni.png'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



const RegistroSolicitudes = () => {
    const { conductores } = useGetConductores();
    const [registros, setRegistros] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [filterId, setFilterId] = useState('');
    const [filterType, setFilterType] = useState('');
    const { tiposVehiculos } = useGetTiposVehiculos();
    const [logoBase64, setLogoBase64] = useState('');

    useEffect(() => {
        const fetchRegistros = async () => {
            const fetchedRegistros = await getAllRegistros();
            console.log('Registros obtenidos:', fetchedRegistros);

            if (Array.isArray(fetchedRegistros)) {
                setRegistros(fetchedRegistros);

            } else {
                console.error('La respuesta de registros no es un arreglo:', fetchedRegistros);
                setRegistros([]); 
            }
        };
        
        const fetchVehiculos = async () => {
            try {
                const vehiculosResponse = await axios.get('/vehicle');
                console.log('Vehículos obtenidos:', vehiculosResponse.data);
                setVehiculos(vehiculosResponse.data);
            } catch (error) {
                console.error('Error al obtener los vehículos:', error);
            }
        };
        const convertToBase64 = async () => {
            const response = await fetch(logo);
            const blob = await response.blob();
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setLogoBase64(reader.result);
            };
            
            reader.readAsDataURL(blob);
        }

        convertToBase64();
        fetchRegistros();
        fetchVehiculos();
    }, []);

    const registrosConVehiculos = registros.map(registro => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.placa === registro.placa_vehiculo);
        const tipoVehiculoNombre = tiposVehiculos.find(tipo => tipo.id_tipo_vehiculo === (vehiculo ? vehiculo.id_tipo_vehiculo : ''))?.nombre || 'Desconocido';
        return {
            ...registro,
            tipo_vehiculo: tipoVehiculoNombre,
        };
    });

    const registrosFiltrados = registrosConVehiculos
        .filter((registro) => registro.id_registro.toString().includes(filterId)) 
        .filter((registro) => filterType ? registro.tipo_vehiculo === filterType : true); 

    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'normal'); 
        doc.setFontSize(14);
        
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 10, 5, 30, 15);  // Posición x, y, ancho, alto
        }
    
        // Encabezado principal
        doc.setFontSize(14);
        doc.text('Informe de Solicitudes', 105, 20, { align: 'center' });
    
        // Definir las columnas para la tabla
        const columns = [
            { title: 'Solicitud ID', dataKey: 'id_registro' },
            { title: 'Nombre Agrupación', dataKey: 'nombre_agrupacion' },
            { title: 'Teléfono', dataKey: 'num_telefono' },
            { title: 'Destino', dataKey: 'destino' },
            { title: 'Fecha Solicitud', dataKey: 'fecha_solicitud' },
            { title: 'Fecha Salida', dataKey: 'fecha_salida' },
            { title: 'Fecha Regreso', dataKey: 'fecha_regreso' },
            { title: 'Estado', dataKey: 'estado' },
            { title: 'Tipo Vehículo', dataKey: 'tipo_vehiculo' },
            { title: 'Vehículo', dataKey: 'placa_vehiculo' },
        ];
    
        // Crear las filas para la tabla usando los datos proporcionados
        const rows = registrosFiltrados.map(registro => ({
            ...registro,
            fecha_solicitud: new Date(registro.fecha_solicitud).toLocaleDateString(),
            fecha_salida: new Date(registro.fecha_salida).toLocaleDateString(),
            fecha_regreso: new Date(registro.fecha_regreso).toLocaleDateString(),
          }));
    
        // Agregar la tabla al PDF
        doc.autoTable({
            columns: columns.map(col => ({ header: col.title, dataKey: col.dataKey })),
            body: rows,
            startY: 40,  
            theme: 'striped', 
            headStyles: {
                fontSize: 8,  
                fontStyle: 'bold',
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'center',
            },
            bodyStyles: {
                fontSize: 8,  
            },
        });
    
        // Guardar el PDF
        doc.save('informe_solicitudes.pdf');
    };
    
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registro de Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de registro'/>
                        <FiltroVehiculo onChange={handleTipoVehiculoChange} />
                        <button onClick={handleDownloadPDF} className='btn-download'>Descargar PDF</button>
                    </div>
                </div>
                <RegistrosTable 
                data={registrosFiltrados} 
                conductores={conductores}
                vehiculos={vehiculos}
                />
            </div>
        </div>
    );
};

export default RegistroSolicitudes;
