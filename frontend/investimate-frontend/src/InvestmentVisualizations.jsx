// src/InvestmentVisualizations.js
import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const InvestmentVisualizations = ({ result }) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red">
        <p className='text-xl text-red-500'>No data available. Please run the simulation first.</p>
      </div>
    );
  }

  // Monthly investment growth over time
  const monthlyValuesChartData = {
    labels: result.monthly_values.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Investment Value Over Time',
        data: result.monthly_values,
        borderColor: 'rgba(54, 162, 235, 1)', // Light blue line
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
      },
    ],
  };

  // Pie chart data for investment breakdown
  const pieChartData = {
    labels: Object.keys(result.investment_breakdown).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        label: 'Investment Breakdown',
        data: Object.values(result.investment_breakdown).map(value => value.toFixed(2)),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Teal
          'rgba(255, 99, 132, 0.7)', // Red
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(255, 159, 64, 0.7)', // Orange
        ],
      },
    ],
  };

  // Bar chart data for investment comparison
  const barChartData = {
    labels: result.monthly_values.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Monthly Growth',
        data: result.monthly_values,
        backgroundColor: 'rgba(255, 159, 64, 1)', // Orange for bars
      },
    ],
  };

  // Options to scale down the chart size and set text colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom width and height
    plugins: {
      legend: {
        labels: {
          color: 'white', // Set legend text color to white
        },
      },
      tooltip: {
        bodyColor: 'white', // Set tooltip text color to white
        titleColor: 'white', // Set tooltip title color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis tick labels color to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis tick labels color to white
        },
      },
    },
  };

  return (
    <div className=' bg-gray-900'>
        <div className="visualizations-container p-4 bg-gray-900"> {/* Added mt-16 to push it below navbar */}
      <h1 className="text-2xl font-bold mb-4 text-teal-400 mt-16 mb-8">Investment Visualizations</h1>
      
      <h2 className="text-xl font-semibold mb-2 text-white">Investment Growth Over Time (Line Chart)</h2>
      <div style={{ height: '300px', width: '100%' }}>
        <Line data={monthlyValuesChartData} options={chartOptions} />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">Investment Breakdown (Pie Chart)</h2>
      <div style={{ height: '300px', width: '100%' }}>
        <Pie data={pieChartData} options={chartOptions} />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-white">Monthly Growth Comparison (Bar Chart)</h2>
      <div style={{ height: '300px', width: '100%' }}>
        <Bar data={barChartData} options={chartOptions} />
      </div>
    </div>
    </div>
    
  );
};

export default InvestmentVisualizations;
