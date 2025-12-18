// Plik: /src/components/HamburgerMenuIcon/HamburgerMenuIcon.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './HamburgerMenuIcon.css';

// Nie potrzebujemy prop 'theme' - mix-blend-mode załatwia wszystko!
function HamburgerMenuIcon({ isOpen, onClick }) {

  const topBarVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 7 }
  };

  const bottomBarVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -7 }
  };

  return (
    <button
      className="hamburger-menu-icon"
      onClick={onClick}
      type="button"
      aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
      aria-expanded={isOpen}
    >
      <motion.div
        className="hamburger-bar top-bar"
        variants={topBarVariants}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      <motion.div
        className="hamburger-bar bottom-bar"
        variants={bottomBarVariants}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </button>
  );
}

export default HamburgerMenuIcon;
