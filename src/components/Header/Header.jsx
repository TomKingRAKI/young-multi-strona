// Plik: /src/components/Header/Header.jsx

import React from 'react';
import { motion, animate } from 'framer-motion';
import './Header.css';
import logoYFL from '../../assets/logoyflczarne.avif';
import HamburgerMenuIcon from '../HamburgerMenuIcon/HamburgerMenuIcon';

function Header({ onMenuClick, isMenuOpen, onCloseClick, startAnimation = false }) {

  const handleLogoClick = () => {
    // "Premium" Scroll: Custom animation with easeOutExpo-ish curve
    const startY = window.scrollY;
    if (startY === 0) return;

    animate(startY, 0, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1], // Dreamy, soft landing curve
      onUpdate: (latest) => window.scrollTo(0, latest)
    });
  };

  return (
    <motion.nav
      className="header-container"
      initial={{ y: -60, opacity: 0 }}
      animate={startAnimation ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      <img
        src={logoYFL}
        alt="YFL Logo"
        className="header-logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />

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
