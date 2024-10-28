// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvestmentSimulator from './InvestmentSimulator'; // Your existing simulator component
import InvestmentVisualizations from './InvestmentVisualizations';
import Navbar from './Navbar';
import './index.css';

const App = () => {
  const [result, setResult] = useState(null); // To hold the simulation results

  const handleSimulationResults = (simulationResult) => {
    setResult(simulationResult); // Store the results in the state
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Create a Home component or use existing */}
        <Route 
          path="/simulate" 
          element={<InvestmentSimulator onResults={handleSimulationResults} />} 
        />
        <Route 
          path="/visualizations" 
          element={<InvestmentVisualizations result={result} />} 
        />
      </Routes>
    </Router>
  );
};

const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
    <h1 className="text-4xl text-teal-400">Welcome to InvestiMate</h1>
    <p className="text-white mt-4">Simulate and visualize your investments.</p>
  </div>
);

export default App;
