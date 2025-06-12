import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/ChoicePage.css';

const ChoicePage = ({ setUserMode }) => {
  const navigate = useNavigate();

  const handleNew = () => {
    sessionStorage.setItem('userMode', 'newEquipment');
    setUserMode('newEquipment');
    navigate('/NewEquipment');
  };

  const handleOld = () => {
    sessionStorage.setItem('userMode', 'reconditionedEquipment');
    setUserMode('reconditionedEquipment');
    navigate('/');
  };

 return (
    <div className="choice-container">
      <div className="choice-card">
        <div className="brand-header">
          <div className="logo-placeholder">FAM MED</div>
          <h1 className="choice-title">Welcome to FAM MED</h1>
          <p className="choice-subtitle">Select your shopping experience</p>
        </div>

        <div className="dual-button-container">
          <button 
            className="choice-button showroom-btn"
            onClick={handleNew}
          >
            <span className="button-icon">🏢</span> {/* Changed from 🆕 to building icon */}
            <span className="button-content">
              <span className="button-main-text">Show Room</span>
              <span className="button-subtext">Experience our premium collection</span>
            </span>
          </button>
          
          <div className="button-divider">
            <span>OR</span>
          </div>
          
          <button 
            className="choice-button shop-btn"
            onClick={handleOld}
          >
            <span className="button-icon">🛒</span> {/* Changed from ♻️ to shopping cart */}
            <span className="button-content">
              <span className="button-main-text">Shop</span>
              <span className="button-subtext">Browse our value selections</span>
            </span>
          </button>
        </div>
      </div>
      
      <footer className="choice-footer">
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/faq">FAQs</a>
        </div>
        <p>© 2025 FAM MED. All rights reserved</p>
      </footer>
    </div>
  );
};

export default ChoicePage;