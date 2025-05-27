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
          <p className="choice-subtitle">Select your equipment preference</p>
        </div>

        <div className="dual-button-container">
          <button 
            className="choice-button new-equipment-btn"
            onClick={handleNew}
          >
            <span className="button-icon">🆕</span>
            <span className="button-content">
              <span className="button-main-text">New Equipment</span>
              <span className="button-subtext">Latest models with full warranty</span>
            </span>
          </button>
          
          <div className="button-divider">
            <span>OR</span>
          </div>
          
          <button 
            className="choice-button reconditioned-btn"
            onClick={handleOld}
          >
            <span className="button-icon">♻️</span>
            <span className="button-content">
              <span className="button-main-text">Reconditioned</span>
              <span className="button-subtext">Certified pre-owned equipment</span>
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