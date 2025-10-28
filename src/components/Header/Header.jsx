// Plik: /src/components/Header/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.png'; 
import HamburgerMenuIcon from '../HamburgerMenuIcon/HamburgerMenuIcon'; // ZMIANA: Importujemy nowy komponent

// ZMIANA: Teraz przyjmujemy 'isMenuOpen'
function Header({ headerTheme, onMenuClick, isMenuOpen, onCloseClick }) {

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
      
      {/* ZMIANA: Renderujemy nowy komponent HamburgerMenuIcon */}
      <HamburgerMenuIcon 
        isOpen={isMenuOpen} // Przekazujemy stan menu
        onClick={isMenuOpen ? onCloseClick : onMenuClick} // Zmieniamy akcję kliknięcia
        theme={headerTheme} // Przekazujemy motyw koloru
      />
    </motion.nav>
  );
}

export default Header;