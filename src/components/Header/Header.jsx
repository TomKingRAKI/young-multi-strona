// Plik: /src/components/Header/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.png';
import HamburgerMenuIcon from '../HamburgerMenuIcon/HamburgerMenuIcon';

function Header({ onMenuClick, isMenuOpen, onCloseClick, startAnimation = false }) {
  return (
    <motion.nav
      className="header-container"
      initial={{ y: -60, opacity: 0 }}
      animate={startAnimation ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      <img src={logoYFL} alt="YFL Logo" className="header-logo" />

      <div className="header-menu-icon-wrapper">
        <HamburgerMenuIcon
          isOpen={isMenuOpen}
          onClick={isMenuOpen ? onCloseClick : onMenuClick}
        />
      </div>
    </motion.nav>
  );
}

export default Header;
