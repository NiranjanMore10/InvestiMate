// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons'; // Import icons

const Navbar = () => {
  return (
    <nav className="bg-gray-400 bg-opacity-10 p-4 fixed w-full z-10 top-0 flex justify-between items-center backdrop-blur-[10px] text-teal-400">
      <div className="text-teal-400 text-lg font-bold">InvestiMate</div>
      <ul className="flex space-x-8 ml-auto">
        <li className="flex items-center"> {/* Added flex for alignment */}
          <FontAwesomeIcon icon={faHome} className="mr-2" /> {/* Home icon */}
          <Link to="/" className="text-white hover:text-teal-400">Home</Link>
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-2" /> {/* Simulate icon */}
          <Link to="/simulate" className="text-white hover:text-teal-400">Simulate</Link>
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faChartPie} className="mr-2" /> {/* Visualizations icon */}
          <Link to="/visualizations" className="text-white hover:text-teal-400">Visualizations</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
