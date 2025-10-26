// Plik: /src/components/Header/Header.jsx
// TO JEST POPRAWNA, "GŁUPIA" WERSJA BEZ 'useState' I 'useScroll'

import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.png'; 

function Header({ headerTheme }) { // Przyjmuje 'headerTheme' z App.jsx

  // Dynamiczne klasy zależą TERAZ TYLKO od 'headerTheme'
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
      <div className="header-menu-icon">&#9776;</div>
    </motion.nav>
  );
}

export default Header;