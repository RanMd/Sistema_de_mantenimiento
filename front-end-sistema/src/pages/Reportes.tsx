import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from '../styles/modules/stats.module.css';
import PieChart from '../components/PieChart';
import InfoBox from '../components/InfoBox';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MantenimientoEstado {
    state_mant: string;
    count: number;
}
/*
interface MantenimientoUsuario {
    user_mant: string;
    count: number;
}*/

interface ActivoEstado {
    state_act: string;
    count: number;
}

interface ActivoTipo {
    type_act: string;
    count: number;
}

interface MantenimientoTipo {
    type_mant: string;
    count: number;
}

const Estadisticas: React.FC = () => {
    const [totalMantenimientos, setTotalMantenimientos] = useState<number | null>(null);
    const [mantenimientosPorEstado, setMantenimientosPorEstado] = useState<MantenimientoEstado[]>([]);
    const [totalActivos, setTotalActivos] = useState<number | null>(null);
    const [activosPorEstado, setActivosPorEstado] = useState<ActivoEstado[]>([]);
    const [activosPorTipo, setActivosPorTipo] = useState<ActivoTipo[]>([]);
    const [mantenimientosPorTipo, setMantenimientosPorTipo] = useState<MantenimientoTipo[]>([]);
    const [totalComponentesUsados, setTotalComponentesUsados] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [
                    mantenimientosTotal,
                    mantenimientosEstado,
                    activosTotal,
                    activosEstado,
                    activosTipo,
                    mantenimientosTipo,
                    componentesUsados,
                ] = await Promise.all([
                    axios.get('http://localhost:3000/api/stats/total'),
                    axios.get('http://localhost:3000/api/stats/estado'),
                    axios.get('http://localhost:3000/api/stats/total-activos'),
                    axios.get('http://localhost:3000/api/stats/por-estado'),
                    axios.get('http://localhost:3000/api/stats/tipos'),
                    axios.get('http://localhost:3000/api/stats/mantenimientos-por-tipo'),
                    axios.get('http://localhost:3000/api/stats/componentes-usados'),
                ]);

                setTotalMantenimientos(mantenimientosTotal.data.total);
                setMantenimientosPorEstado(mantenimientosEstado.data);
                setTotalActivos(activosTotal.data.total);
                setActivosPorEstado(activosEstado.data);
                setActivosPorTipo(activosTipo.data);
                setMantenimientosPorTipo(mantenimientosTipo.data);
                setTotalComponentesUsados(componentesUsados.data.totalComponentes);
            } catch (err: any) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    const createPieData = (labels: string[], data: number[]) => ({
        labels,
        datasets: [
            {
                data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    });

    const mantenimientosEstadoData = createPieData(
        mantenimientosPorEstado.map((item) => item.state_mant),
        mantenimientosPorEstado.map((item) => item.count)
    );

    const activosEstadoData = createPieData(
        activosPorEstado.map((item) => item.state_act),
        activosPorEstado.map((item) => item.count)
    );

    const activosTipoData = createPieData(
        activosPorTipo.map((item) => item.type_act),
        activosPorTipo.map((item) => item.count)
    );

    const mantenimientosTipoData = createPieData(
        mantenimientosPorTipo.map((item) => item.type_mant),
        mantenimientosPorTipo.map((item) => item.count)
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Estadísticas del sistema</h1>
            <div className={styles.infoBox}>
                <InfoBox label="Activos totales" value={totalActivos} />
                <InfoBox label="Mantenimientos totales" value={totalMantenimientos} />
                <InfoBox label="Componentes Usados" value={totalComponentesUsados} />
            </div>
            <div className={styles.grid}>
                <PieChart title="Mantenimientos por Estado" data={mantenimientosEstadoData} />
                <PieChart title="Activos por Estado" data={activosEstadoData} />
                <PieChart title="Activos por Tipo" data={activosTipoData} />
                <PieChart title="Mantenimientos por Tipo" data={mantenimientosTipoData} />
            </div>


        </div>
    );
};

export default Estadisticas;