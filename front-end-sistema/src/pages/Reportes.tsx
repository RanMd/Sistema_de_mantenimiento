import React, { useState, useEffect } from 'react';
import Grafico from '../components/GraficoDinamico';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Mantenimiento {
    num_mant: number;
    attendant_mant: string;
    date_start_mant: string;
    date_end_mant: string | null;
    code_mant: string;
    state_mant: string;
    type_attendant_mant: string;
}

interface Activo {
    id_act: number;
    name_act: string;
    code_act: string;
    ubication_act: string;
    state_act: string;
    brand_act: string;
    type_act: string;
    buy_process_act: string;
    in_maintenance: boolean;
}

const ReportesCombinados: React.FC = () => {
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [activos, setActivos] = useState<Activo[]>([]);
    const [filtrosMantenimientos, setFiltrosMantenimientos] = useState<Record<string, string>>({});
    const [filtrosActivos, setFiltrosActivos] = useState<Record<string, string>>({});
    const [useStartMonth, setUseStartMonth] = useState(true);

    useEffect(() => {
        const cachedMantenimientos = localStorage.getItem('mantenimientos');
        const cachedActivos = localStorage.getItem('activos');

        if (cachedMantenimientos) {
            setMantenimientos(JSON.parse(cachedMantenimientos));
        } else {
            fetch('http://localhost:3000/api/stats/mantenimientos')
                .then((response) => response.json())
                .then((data) => {
                    setMantenimientos(data);
                    localStorage.setItem('mantenimientos', JSON.stringify(data));
                })
                .catch((error) => console.error('Error al obtener los mantenimientos:', error));
        }

        if (cachedActivos) {
            setActivos(JSON.parse(cachedActivos));
        } else {
            fetch('http://localhost:3000/api/stats/activos')
                .then((response) => response.json())
                .then((data) => {
                    setActivos(data);
                    localStorage.setItem('activos', JSON.stringify(data));
                })
                .catch((error) => console.error('Error al obtener los activos:', error));
        }
    }, []);

    const style = {
        container: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
        header: { textAlign: 'center' as 'center', color: '#333', fontSize: '2rem', marginBottom: '20px' },
        filterGroup: { display: 'flex', flexWrap: 'wrap' as 'wrap', gap: '10px', marginBottom: '20px', alignItems: 'center' },
        label: { display: 'block', marginBottom: '5px', color: '#555' },
        select: { width: '100%', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
        buttonClear: { backgroundColor: '#000033', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' },
        toggleButton: { backgroundColor: '#000033', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' },
        section: { marginBottom: '30px' },
        buttonExport: { backgroundColor: '#000033', color: '#fff', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', marginTop: '20px' }
    };

    const handleFilterChange = (campo: string, valor: string) => {
        setFiltrosMantenimientos((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleClearFilters = () => {
        setFiltrosMantenimientos({});
    };

    const handleFilterChangeActivo = (campo: string, valor: string) => {
        setFiltrosActivos((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleClearFiltersActivos = () => {
        setFiltrosActivos({});
    };

    const mantenimientosFiltrados = mantenimientos.filter((mant) =>
        Object.entries(filtrosMantenimientos).every(([campo, valor]) => {
            if (!valor) return true;
            return mant[campo as keyof Mantenimiento]?.toString().toLowerCase().includes(valor.toLowerCase());
        })
    );

    const activosFiltrados = activos.filter((activo) =>
        Object.entries(filtrosActivos).every(([campo, valor]) => {
            if (!valor) return true;
            return activo[campo as keyof Activo]?.toString().toLowerCase().includes(valor.toLowerCase());
        })
    );

    const mantenimientosPorMes = mantenimientosFiltrados.reduce((acc: Record<string, number>, mant) => {
        const mes = useStartMonth
            ? new Date(mant.date_start_mant).toLocaleString('default', { month: 'long', year: 'numeric' })
            : mant.date_end_mant ? new Date(mant.date_end_mant).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Desconocido';

        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
    }, {});

    const activosPorMes = activosFiltrados.reduce((acc: Record<string, number>, activo) => {
        const mes = new Date(activo.buy_process_act).toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
    }, {});

    const datosGraficoMantenimientos = {
        labels: Object.keys(mantenimientosPorMes),
        datasets: [
            {
                label: `Mantenimientos por Mes (${useStartMonth ? 'Inicio' : 'Fin'})`,
                data: Object.values(mantenimientosPorMes),
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const datosGraficoActivos = {
        labels: Object.keys(activosPorMes),
        datasets: [
            {
                label: 'Activos por Mes de Compra',
                data: Object.values(activosPorMes),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Capturar y agregar el gráfico de Mantenimientos
        html2canvas(document.querySelector('#graficoMantenimientos') as HTMLElement).then((canvas) => {
            const imgDataMantenimientos = canvas.toDataURL('image/png');
            doc.addImage(imgDataMantenimientos, 'PNG', 10, 10, 180, 160); // Agregar la imagen del gráfico de mantenimientos
            doc.setFontSize(14);
            doc.text('Reporte de Mantenimientos por mes de ' + (useStartMonth ? 'Inicio' : 'Fin'), 10, 180);

            // Agregar las estadísticas de Mantenimientos
            doc.setFontSize(12);
            doc.text(`Cantidad total de mantenimientos: ${mantenimientosFiltrados.length}`, 10, 200);

            const mantenimientosPorEstado = mantenimientosFiltrados.reduce((acc: Record<string, number>, mant) => {
                acc[mant.state_mant] = (acc[mant.state_mant] || 0) + 1;
                return acc;
            }, {});

            doc.text('Cantidad de mantenimientos por estado:', 10, 210);
            Object.entries(mantenimientosPorEstado).forEach(([estado, cantidad], index) => {
                doc.text(`${estado}: ${cantidad}`, 10, 220 + (index * 10));
            });

            const mantenimientosPorEncargado = mantenimientosFiltrados.reduce((acc: Record<string, number>, mant) => {
                acc[mant.attendant_mant] = (acc[mant.attendant_mant] || 0) + 1;
                return acc;
            }, {});

            doc.text('Cantidad de mantenimientos por encargado:', 10, 230 + Object.entries(mantenimientosPorEstado).length * 10);
            Object.entries(mantenimientosPorEncargado).forEach(([encargado, cantidad], index) => {
                doc.text(`${encargado}: ${cantidad}`, 10, 240 + (index * 10));
            });

            // Nueva página si es necesario
            if (doc.internal.pageSize.height < 370) {
                doc.addPage();
            }

            // Capturar y agregar el gráfico de Activos
            html2canvas(document.querySelector('#graficoActivos') as HTMLElement).then((canvas) => {
                const imgDataActivos = canvas.toDataURL('image/png');
                doc.addImage(imgDataActivos, 'PNG', 10, 10, 180, 160); // Agregar la imagen del gráfico de activos
                doc.setFontSize(14);
                doc.text('Reporte de Activos por mes de Compra', 10, 180);

                // Agregar las estadísticas de Activos
                doc.setFontSize(12);
                doc.text(`Cantidad total de activos: ${activosFiltrados.length}`, 10, 200);

                const activosPorUbicacion = activosFiltrados.reduce((acc: Record<string, number>, activo) => {
                    acc[activo.ubication_act] = (acc[activo.ubication_act] || 0) + 1;
                    return acc;
                }, {});
                doc.text('Cantidad de activos por ubicación:', 10, 210);
                Object.entries(activosPorUbicacion).forEach(([ubicacion, cantidad], index) => {
                    doc.text(`${ubicacion}: ${cantidad}`, 10, 220 + (index * 10));
                });

                const activosPorEstado = activosFiltrados.reduce((acc: Record<string, number>, activo) => {
                    acc[activo.state_act] = (acc[activo.state_act] || 0) + 1;
                    return acc;
                }, {});
                doc.text('Cantidad de activos por estado:', 10, 230 + Object.entries(activosPorUbicacion).length * 10);
                Object.entries(activosPorEstado).forEach(([estado, cantidad], index) => {
                    doc.text(`${estado}: ${cantidad}`, 10, 240 + (index * 10));
                });

                // Guardar el PDF
                doc.save('reportes.pdf');
            });
        });
    };

    return (
        <div style={style.container}>
            {/* Reporte de Mantenimientos */}
            <h1 style={style.header}>Reportes de Mantenimientos</h1>
            <div style={style.filterGroup}>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Estado de Mantenimiento: </label>
                    <select onChange={(e) => handleFilterChange('state_mant', e.target.value)} value={filtrosMantenimientos['state_mant'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(mantenimientos.map((mant) => mant.state_mant))).map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Encargado del Mantenimiento: </label>
                    <select onChange={(e) => handleFilterChange('attendant_mant', e.target.value)} value={filtrosMantenimientos['attendant_mant'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(mantenimientos.map((mant) => mant.attendant_mant))).map((encargado) => (
                            <option key={encargado} value={encargado}>
                                {encargado}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Tipo de Encargado: </label>
                    <select onChange={(e) => handleFilterChange('type_attendant_mant', e.target.value)} value={filtrosMantenimientos['type_attendant_mant'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(mantenimientos.map((mant) => mant.type_attendant_mant))).map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={handleClearFilters} style={style.buttonClear}>Limpiar Filtros</button>
                    <button onClick={() => setUseStartMonth(!useStartMonth)} style={style.toggleButton}>
                        Mostrar por {useStartMonth ? 'Fecha de Inicio' : 'Fecha de Fin'}
                    </button>
                </div>
            </div>

            <div id="graficoMantenimientos" style={style.section}>
                <Grafico datos={datosGraficoMantenimientos} />
            </div>

            {/* Reporte de Activos */}
            <h1 style={style.header}>Reportes de Activos</h1>
            <div style={style.filterGroup}>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Estado del Activo: </label>
                    <select onChange={(e) => handleFilterChangeActivo('state_act', e.target.value)} value={filtrosActivos['state_act'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(activos.map((activo) => activo.state_act))).map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Tipo de Activo: </label>
                    <select onChange={(e) => handleFilterChangeActivo('type_act', e.target.value)} value={filtrosActivos['type_act'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(activos.map((activo) => activo.type_act))).map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={style.label}>Ubicación del Activo: </label>
                    <select onChange={(e) => handleFilterChangeActivo('ubication_act', e.target.value)} value={filtrosActivos['ubication_act'] || ''} style={style.select}>
                        <option value="">Todos</option>
                        {Array.from(new Set(activos.map((activo) => activo.ubication_act))).map((ubicacion) => (
                            <option key={ubicacion} value={ubicacion}>
                                {ubicacion}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={handleClearFiltersActivos} style={style.buttonClear}>Limpiar Filtros</button>
                </div>
            </div>

            <div id="graficoActivos" style={style.section}>
                <Grafico datos={datosGraficoActivos} />
            </div>

            <button onClick={handleExportPDF} style={style.buttonExport}>Exportar a PDF</button>
        </div>
    );
};

export default ReportesCombinados;
