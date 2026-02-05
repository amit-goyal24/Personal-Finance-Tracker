import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { GlobalContext } from '../context/GlobalState';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Chart = () => {
    const { transactions } = useContext(GlobalContext);

    const expenses = transactions.filter(t => t.amount < 0);
    const labels = expenses.map(t => t.text);
    const dataValues = expenses.map(t => Math.abs(t.amount));

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Expenses',
                data: dataValues,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    return (
        <div className="chart-container">
            {expenses.length > 0 ? <Doughnut data={data} options={options} /> : <p>No expenses to display</p>}
        </div>
    );
};
