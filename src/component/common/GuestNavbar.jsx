import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/GuestNavbar.css';

const GuestNavbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/NewEquipment" className="navbar-link">
          Home
        </Link>
        <div className="navbar-links">
          <Link to="/about" className="navbar-link">
            About us
          </Link>
          <Link to="/contact" className="navbar-link">
            Contact us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;
