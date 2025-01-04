import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    title: string;
    data: {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    width?: string;
    height?: string;
}

const PieChart: React.FC<PieChartProps> = ({ title, data, width = '250px', height = '250px' }) => {
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const dataset = tooltipItem.dataset;
                        const dataIndex = tooltipItem.dataIndex;
                        const label = data.labels[dataIndex];
                        const value = dataset.data[dataIndex];
                        return `${label}: ${value}`;
                    },
                },
            },
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: width }}>
            <h2>{title}</h2>
            <div style={{ width, height, margin: '0 auto' }}>
                <Pie data={data} options={options as any} />
            </div>
        </div>
    );
};

export default PieChart;
