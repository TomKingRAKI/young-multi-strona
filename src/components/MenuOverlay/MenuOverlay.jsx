// Plik: /src/components/MenuOverlay/MenuOverlay.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MenuOverlay.css';
import PixelCard from '../PixelCard/PixelCard';

function MenuOverlay() {

  // 1. Warianty TŁA (bez zmian)
  const overlayVariants = {
    initial: { y: "-100%" },
    animate: { y: "0%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
    exit: { 
      y: "-100%", 
      transition: { 
        duration: 0.6, 
        ease: [0.76, 0, 0.24, 1], 
        delay: 0.8 // ZMIANA: Czeka 0.8s aż wszystko spadnie
      } 
    }
  };

  // 2. Warianty OBRAZKA (z '100%' zamiast '1000px')
  const imageVariants = {
    initial: { y: "1000px" }, // Teraz '100%' zadziała, bo .menu-image-side ma overflow: hidden
    animate: { 
      y: "0%", 
      transition: { 
        delay: 1.1, // Czeka na tło (0.6) i linki (0.5)
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
    exit: { 
      y: "1000px", // Spada na dół
      transition: { duration: 0.5, ease: [0.6, 0.04, 0.98, 0.34] } // Znika jako pierwszy
    }
  };

  // 3. ZMIANA: Warianty dla KONTENERA LINKÓW (do 'staggerowania')
  const linksContainerVariants = {
    animate: {
      transition: {
        delayChildren: 0.6, // Czeka na tło
        staggerChildren: 0.08 // Odstęp 0.08s między każdym linkiem
      }
    },
    exit: {
      transition: {
        delay: 0.4, // Czeka na obrazek
        staggerChildren: 0.08,
        staggerDirection: -1 // Od ostatniego do pierwszego
      }
    }
  };

  // 4. ZMIANA: Warianty dla POJEDYNCZEGO LINKU
  const linkItemVariants = {
    initial: { y: "1000px" }, // 100% wysokości (rodzic ma overflow: hidden)
    animate: { y: "0%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { y: "1000px", transition: { duration: 0.4, ease: [0.6, 0.04, 0.98, 0.34] } }
  };


return (
    <motion.div 
      className="menu-overlay"
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="menu-grid">
        
        {/* LEWA STRONA (Obrazek) */}
        <div className="menu-image-side">
          {/* Ten kontener nadal śledzi myszkę */}
          <motion.div 
            className="menu-image-container"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PixelCard variant="default">
                <div className="menu-image-bw"></div>
            </PixelCard>
          </motion.div>
        </div>
        
        {/* PRAWA STRONA (Linki) - bez zmian */}
        <div className="menu-links-side">
          <motion.nav
            variants={linksContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={linkItemVariants} className="menu-link-wrapper">
              <a href="#" className="menu-link">HOME</a><br/>
            </motion.div>
            <motion.div variants={linkItemVariants} className="menu-link-wrapper">
              <a href="#" className="menu-link">MUZYKA</a><br/>
            </motion.div>
            <motion.div variants={linkItemVariants} className="menu-link-wrapper">
              <a href="#" className="menu-link">O MNIE</a><br/>
            </motion.div>
            <motion.div variants={linkItemVariants} className="menu-link-wrapper">
              <a href="#" className="menu-link">MERCH</a><br/>
            </motion.div>
            <motion.div variants={linkItemVariants} className="menu-link-wrapper">
              <a href="#" className="menu-link">KONTAKT</a>
            </motion.div>
          </motion.nav>
        </div>
        
      </div>
    </motion.div>
  );
}

export default MenuOverlay;