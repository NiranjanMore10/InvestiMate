// src/InvestmentSimulator.js
import React, { useState } from 'react';
import axios from 'axios';
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
import './index.css'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InvestmentSimulator = ({ onResults }) => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('low');
  const [numYears, setNumYears] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
    const numDays = numYears * 365;

    try {
      const response = await axios.post('http://localhost:5000/simulate', {
        initial_investment: parseFloat(initialInvestment),
        risk_tolerance: riskTolerance,
        num_days: numDays,
      });

      setResult(response.data);
      onResults(response.data); // Pass results to parent
      setIsSubmitted(true); // Update state to hide the form
      setLoading(false); // Stop loading after data is fetched
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while simulating the investment.');
      setLoading(false); // Stop loading on error
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'table' ? 'graph' : 'table'));
  };

  const monthlyValuesChartData = {
    labels: result?.monthly_values.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Investment Value Over Time',
        data: result?.monthly_values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Function to download CSV
  const downloadCSV = () => {
    const headers = ['Month', 'Investment Value (₹)', ...Object.keys(result.investment_breakdown)];
    const rows = result.monthly_values.map((value, index) => {
      const breakdown = Object.values(result.investment_breakdown).map(v => v.toFixed(2));
      return [index + 1, value.toFixed(2), ...breakdown];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "investment_simulation_results.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-grow flex items-center justify-center overflow-y-auto mt-4">
        <div className="rounded-lg shadow-lg p-6 w-full max-w-lg">
          {!isSubmitted ? ( // Conditional rendering based on submission state
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label className="block text-white">
                  Initial Investment (₹):
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    required
                    min="1"
                    step="any"
                    className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-white">
                  Risk Tolerance:
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-white">
                  Number of Years:
                  <input
                    type="number"
                    value={numYears}
                    onChange={(e) => setNumYears(e.target.value)}
                    required
                    min="1"
                    className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </label>
              </div>
              <button type="submit" className="w-full p-2 bg-teal-500 text-white rounded hover:bg-teal-400">
                Simulate Investment
              </button>
            </form>
          ) : (
            // Render the results after submission
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              {loading ? ( // Display loading message with spinner
                <div className="flex flex-col items-center justify-center">
                  <p className="text-white mb-2">Simulating...</p>
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-teal-400">Simulation Results</h3>
                  <p className='text-white'>Final Investment Value: ₹{result.final_investment_value.toFixed(2)}</p>
                  <p className='text-white'>Total Returns: ₹{result.total_returns.toFixed(2)}</p>
                  <h4 className="font-semibold text-teal-400">Investment Breakdown:</h4>
                  <ul className="list-disc list-inside">
                    {Object.entries(result.investment_breakdown).map(([key, value]) => (
                      <li key={key} className='text-white'>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: ₹{value.toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  <button onClick={toggleViewMode} className="mt-2 w-full p-2 bg-green-500 text-white rounded hover:bg-green-400">
                    {viewMode === 'table' ? 'View as Graph' : 'View as Table'}
                  </button>

                  <button onClick={downloadCSV} className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-400">
                    Download CSV
                  </button>

                  {viewMode === 'table' ? (
                    <table className="mt-4 w-full border border-gray-600 rounded">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-2 text-left text-white">Category</th>
                          <th className="p-2 text-left text-white">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.investment_breakdown).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-600 text-white">
                            <td className="p-2">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                            <td className="p-2">₹{value.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="mt-4 text-white">
                      <h4 className="font-semibold text-teal-400">Monthly Investment Growth</h4>
                      <Line data={monthlyValuesChartData} options={{ responsive: true }} className='text-white' />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;
