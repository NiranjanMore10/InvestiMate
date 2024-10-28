import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Visualizations = ({ result }) => {
    if (!result) return <p>No data available for visualization.</p>;

    const monthlyValuesChartData = {
        labels: result.monthly_values.map((_, index) => `Month ${index + 1}`),
        datasets: [
            {
                label: 'Investment Value Over Time',
                data: result.monthly_values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <div>
            <h2>Visualizations</h2>
            <h3>Monthly Investment Growth</h3>
            <Line data={monthlyValuesChartData} options={{ responsive: true }} />
            <h3>Investment Breakdown:</h3>
            <ul>
                {Object.entries(result.investment_breakdown).map(([key, value]) => (
                    <li key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: ₹{value.toFixed(2)}
                    </li>
                ))}
            </ul>
            <p>Final Investment Value: ₹{result.final_investment_value.toFixed(2)}</p>
            <p>Total Returns: ₹{result.total_returns.toFixed(2)}</p>
        </div>
    );
};

export default Visualizations;
