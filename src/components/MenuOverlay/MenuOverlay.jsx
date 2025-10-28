// Plik: /src/components/MenuOverlay/MenuOverlay.jsx

import React from 'react';
import './MenuOverlay.css';

// ZMIANA 1: Przyjmujemy funkcję 'onCloseClick'
function MenuOverlay({ onCloseClick }) {
  return (
    <div className="menu-overlay">
      
      <div className="menu-grid">
        <div className="menu-image-side">
          <div className="menu-image-container">
            {/* Obrazek jest w CSS */}
          </div>
        </div>
        
        <div className="menu-links-side">
          <nav>
            <a href="#" className="menu-link">HOME</a><br />
            <a href="#" className="menu-link">MUZYKA</a><br />
            <a href="#" className="menu-link">O MNIE</a><br />
            <a href="#" className="menu-link">MERCH</a><br />
            <a href="#" className="menu-link">KONTAKT</a>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;