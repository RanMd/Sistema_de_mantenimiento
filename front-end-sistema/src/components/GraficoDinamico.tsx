import React from 'react';
import { Bar } from 'react-chartjs-2';

interface GraficoProps {
    datos: any;
}

const Grafico: React.FC<GraficoProps> = ({ datos }) => {
    const opciones = {
        plugins: {
            title: {
                display: false, // Eliminamos el título del gráfico
            },
        },
    };

    // Estilos en línea como un objeto de estilo
    const style = {
        graficoContainer: {
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        canvas: {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
        },
    };

    return (
        <div style={style.graficoContainer}>
            <Bar data={datos} options={opciones} />
        </div>
    );
};

export default Grafico;
