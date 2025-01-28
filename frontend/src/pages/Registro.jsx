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
        doc.setFontSize(14); // Tamaño mayor para el encabezado
        doc.text('Informe de Solicitudes', 105, 20, { align: 'center' });
    
        let y = 40;
        const columnLeftX = 20;  // Columna izquierda (posición fija)
        const columnRightX = 120;  // Columna derecha (posición fija)
    
        // Añadir encabezado a cada página
        const addPageHeader = () => {
            doc.setFontSize(10);  // Tamaño estándar para el encabezado de la página
            doc.text('Informe de Solicitudes', 105, 10, { align: 'center' });
            doc.setLineWidth(0.5);
            doc.line(10, 15, 200, 15);  // Línea horizontal bajo el encabezado
        };
    
        registrosFiltrados.forEach((registro, index) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
                addPageHeader(); // Agregar encabezado en la nueva página
            }
    
            // Información de la solicitud en la columna izquierda
            doc.setFontSize(10);  // Usar tamaño estándar para todos los campos
            doc.text(`Solicitud ID: ${registro.id_registro}`, columnLeftX, y);
            doc.text(`Nombre Agrupación: ${registro.nombre_agrupacion}`, columnLeftX, y + 10);
            doc.text(`Teléfono: ${registro.num_telefono}`, columnLeftX, y + 20);
            doc.text(`Destino: ${registro.destino}`, columnLeftX, y + 30);
            doc.text(`Fecha Solicitud: ${registro.fecha_solicitud}`, columnLeftX, y + 40);
            doc.text(`Fecha Salida: ${registro.fecha_salida}`, columnLeftX, y + 50);
            doc.text(`Fecha Regreso: ${registro.fecha_regreso}`, columnLeftX, y + 60);
    
            // Información adicional sobre el vehículo en la columna derecha
            doc.text(`Estado: ${registro.estado}`, columnRightX, y + 10);
            doc.text(`Prioridad: ${registro.prioridad}`, columnRightX, y + 20);
            doc.text(`Tipo Vehículo: ${registro.tipo_vehiculo}`, columnRightX, y + 30);
            doc.text(`Vehículo: ${registro.placa_vehiculo}`, columnRightX, y + 40);
            
            
            doc.setDrawColor(173, 216, 230); 
            doc.setLineWidth(0.5);
            doc.line(10, y + 70, 200, y + 70);
            
            y += 80;  
    
        });
    
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
