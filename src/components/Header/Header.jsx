// Plik: /src/components/Header/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.png';
import HamburgerMenuIcon from '../HamburgerMenuIcon/HamburgerMenuIcon';

// Dodajemy prop 'theme' ('light' lub 'dark')
function Header({ onMenuClick, isMenuOpen, onCloseClick, theme = 'light' }) {

  return (
    <motion.nav
      // Dodajemy klasę dynamicznie: header-light lub header-dark
      className={`header-container header-${theme}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <img src={logoYFL} alt="YFL Logo" className="header-logo" />

      <div className="header-menu-icon-wrapper">
        {/* Używamy naszego nowego hamburgera */}
        {/* Ważne: musimy zaktualizować Hamburger.css, żeby używał currentColor, 
            albo możemy zrobić to prymitywnie CSS-em w headerze, 
            ALE najprościej przekazać klasę do wrappera powyżej (co zrobiliśmy w CSS) */}

        <HamburgerMenuIcon
          isOpen={isMenuOpen}
          onClick={isMenuOpen ? onCloseClick : onMenuClick}
        />
      </div>
    </motion.nav>
  );
}

export default Header;