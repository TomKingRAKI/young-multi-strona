// Plik: /src/components/HamburgerMenuIcon/HamburgerMenuIcon.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './HamburgerMenuIcon.css';

// Przyjmujemy 'isOpen' (czy menu jest otwarte) i 'onClick' (funkcję do kliknięcia)
function HamburgerMenuIcon({ isOpen, onClick, theme }) {

  // Warianty animacji dla każdego paska
  const topBarVariants = {
    closed: { rotate: 0, y: 0 }, // W stanie zamkniętym: bez obrotu, na swojej pozycji
    open: { rotate: 45, y: 7 }    // W stanie otwartym: obróć o 45 stopni, przesuń w dół
  };

  const bottomBarVariants = {
    closed: { rotate: 0, y: 0 },  // W stanie zamkniętym: bez obrotu, na swojej pozycji
    open: { rotate: -45, y: -7 }  // W stanie otwartym: obróć o -45 stopni, przesuń w górę
  };

  return (
    <div 
      className={`hamburger-menu-icon ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} 
      onClick={onClick}
    >
      {/* Górny pasek */}
      <motion.div 
        className="hamburger-bar top-bar"
        variants={topBarVariants}
        animate={isOpen ? "open" : "closed"} // Animuj w zależności od 'isOpen'
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      
      {/* Dolny pasek */}
      <motion.div 
        className="hamburger-bar bottom-bar"
        variants={bottomBarVariants}
        animate={isOpen ? "open" : "closed"} // Animuj w zależności od 'isOpen'
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </div>
  );
}

export default HamburgerMenuIcon;