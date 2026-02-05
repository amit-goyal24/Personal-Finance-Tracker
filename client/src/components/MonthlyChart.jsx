import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { GlobalContext } from '../context/GlobalState';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MonthlyChart = () => {
    const { transactions } = useContext(GlobalContext);

    // Helper to group by Month-Year
    const monthlyData = {};

    transactions.forEach(transaction => {
        if (transaction.amount < 0) {
            const date = new Date(transaction.createdAt || Date.now()); // Fallback to now if no date
            const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });

            if (!monthlyData[key]) monthlyData[key] = 0;
            monthlyData[key] += Math.abs(transaction.amount);
        }
    });

    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);

    const data = {
        labels,
        datasets: [
            {
                label: 'Monthly Expenses',
                data: values,
                backgroundColor: '#6366f1',
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Monthly Expense Trend',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="chart-container" style={{ marginTop: '20px' }}>
            {labels.length > 0 ? <Bar data={data} options={options} /> : <p className="text-center">Add expenses to see trends</p>}
        </div>
    );
};
