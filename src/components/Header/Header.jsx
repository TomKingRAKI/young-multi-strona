// Plik: /src/components/Header/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.png'; 

// ZMIANA 1: Przyjmujemy nowe propsy
function Header({ headerTheme, onMenuClick, onCloseClick, isMenuOpen }) {

  const headerClasses = [
    "header-container",
    headerTheme === 'light' ? "theme-light" : "theme-dark"
  ].join(" ");

  return (
    <motion.nav 
      className={headerClasses}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <img src={logoYFL} alt="YFL Logo" className="header-logo" />
      
      {/* ZMIANA 2: Logika warunkowa dla ikon */}
      {isMenuOpen ? (
        // Jeśli menu jest otwarte, pokaż "X" i podepnij funkcję zamykania
        <div 
          className="header-menu-icon" 
          onClick={onCloseClick}
        >
          &#10005; {/* Znak 'X' */}
        </div>
      ) : (
        // Jeśli menu jest zamknięte, pokaż hamburger i podepnij funkcję otwierania
        <div 
          className="header-menu-icon" 
          onClick={onMenuClick}
        >
          &#9776; {/* Znak hamburgera */}
        </div>
      )}
    </motion.nav>
  );
}

export default Header;