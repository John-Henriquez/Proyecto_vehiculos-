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
        const vehiculo = vehiculos.find(v => v.placa === registro.placa_vehiculo);
   
        const tipoNombre = tiposVehiculos.find(
            tipo => tipo.id_tipo_vehiculo === vehiculo?.id_tipo_vehiculo
        )?.nombre || "No especificado";
   
        const vehiculoCompleto = vehiculo
        ? `${tipoNombre} / ${vehiculo.placa} / ${vehiculo.marca} ${vehiculo.modelo}`
        : "No especificado";

    return {
        ...registro,
        vehiculo: vehiculo || null,
        id_tipo_vehiculo: vehiculo?.id_tipo_vehiculo,
        tipo_vehiculo_nombre: tipoNombre,
        vehiculo_completo: vehiculoCompleto, // Nuevo campo combinado
    };
});;

    const registrosFiltrados = registrosConVehiculos
        .filter((registro) => registro.id_registro.toString().includes(filterId))
        .filter(registro => filterType ? registro.id_tipo_vehiculo=== filterType : true);
       
    const handleTipoVehiculoChange = (tipo) => {
        setFilterType(tipo);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
    
        const formatDate = (date) => {
            if (!date) return '-';
            const d = new Date(date);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        };
    
        const formatPhone = (phone) => {
            return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '+56 $1 $2 $3') || '-';
        };
    
        doc.setFont('helvetica');
        doc.setFontSize(10);
    
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 10, 5, 30, 15);
        }
    
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Informe de Solicitudes de Transporte', pageWidth / 2, 25, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, pageWidth - 15, 20, { align: 'right' });
    
        const columns = [
            { title: 'ID', dataKey: 'id_registro', width: 20 },
            { title: 'Agrupación', dataKey: 'nombre_agrupacion', width: 40 },
            { title: 'Teléfono', dataKey: 'num_telefono', width: 30 },
            { title: 'Destino', dataKey: 'destino', width: 40 },
            { title: 'Creación', dataKey: 'fecha_solicitud', width: 25 },
            { title: 'Salida', dataKey: 'fecha_salida', width: 25 },
            { title: 'Regreso', dataKey: 'fecha_regreso', width: 25 },
            { title: 'Estado', dataKey: 'estado', width: 25 },
            { title: 'Vehículo', dataKey: 'vehiculo_completo', width: 50 }, 
            { title: 'Conductor', dataKey: 'nombre_conductor', width: 40 },
        ];
    
        const conductoresMap = conductores.reduce((acc, conductor) => {
            acc[conductor.rut_conductor] = conductor.nombre;
            return acc;
        }, {});
    
        const rows = registrosFiltrados.map(registro => {
            const rutConductor = registro.rut_conductor;
            const nombreConductor = conductoresMap[rutConductor] || 'Desconocido';
    
            return {
                ...registro,
                id_registro: registro.id_registro.toString().padStart(3, '0'),
                num_telefono: formatPhone(registro.num_telefono),
                nombre_conductor: nombreConductor,
                fecha_solicitud: formatDate(registro.fecha_solicitud),
                fecha_salida: formatDate(registro.fecha_salida),
                fecha_regreso: registro.estado === 'Rechazada' ? '-' : formatDate(registro.fecha_regreso),
                vehiculo_completo: registro.vehiculo_completo,
            };
        });
    
        doc.autoTable({
            columns: columns.map(col => ({
                header: col.title,
                dataKey: col.dataKey,
                styles: { cellWidth: col.width }
            })),
            body: rows,
            startY: 40,
            theme: 'grid',
            styles: {
                font: 'helvetica',
                fontSize: 8,
                cellPadding: 2,
                textColor: [50, 50, 50],
                lineColor: [200, 200, 200],
                lineWidth: 0.25,
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [51, 102, 153],
                textColor: [255, 255, 255],
                fontSize: 9,
                halign: 'center',
                valign: 'middle'
            },
            bodyStyles: {
                halign: 'center',
                valign: 'middle'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 40 },
            tableWidth: 'auto',
            didParseCell: (data) => {
                if (data.column.dataKey === 'nombre_agrupacion' || data.column.dataKey === 'destino') {
                    data.cell.styles.halign = 'left';
                }
            }
        });
    
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - 25, doc.internal.pageSize.getHeight() - 10);
        }
    
        doc.save('informe_solicitudes.pdf');
    };
    

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Registro de Solicitudes</h1>
                    <div className='filter-actions'>
                        <Search value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder='Filtrar por ID de registro'/>
                        <FiltroVehiculo
                        options={tiposVehiculos.map(t => ({
                            value: t.id_tipo_vehiculo,
                            label: t.nombre
                        }))}
                        onChange={handleTipoVehiculoChange}
                        />

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