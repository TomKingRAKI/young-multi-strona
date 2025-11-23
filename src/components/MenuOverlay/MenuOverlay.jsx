// Plik: /src/components/MenuOverlay/MenuOverlay.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './MenuOverlay.css';
import PixelCard from '../PixelCard/PixelCard';

function MenuOverlay({ onSectionClick }) {

  // Funkcja teraz jest prosta: przekaż kliknięcie wyżej
  const handleLinkClick = (sectionId) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  // --- WARIANTY ANIMACJI (Klasyczne) ---

  const overlayVariants = {
    initial: { y: "-100%" },
    animate: { y: "0%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
    exit: {
      y: "-100%",
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.4 // Czekamy, aż linki i obrazek spadną, zanim tło wyjedzie
      }
    }
  };

  const imageVariants = {
    initial: { y: "150%" },
    animate: { y: "0%", transition: { delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    exit: { y: "150%", transition: { duration: 0.5, ease: [0.6, 0.04, 0.98, 0.34] } }
  };

  const linksContainerVariants = {
    animate: { transition: { delayChildren: 0.6, staggerChildren: 0.08 } },
    exit: { transition: { delay: 0, staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const linkItemVariants = {
    initial: { y: "1000px" },
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
        {/* LEWA STRONA */}
        <div className="menu-image-side">
          <motion.div className="menu-image-container" variants={imageVariants}>
            <PixelCard variant="default">
              <div className="menu-image-bw"></div>
            </PixelCard>
          </motion.div>
        </div>

        {/* PRAWA STRONA */}
        <div className="menu-links-side">
          <motion.nav variants={linksContainerVariants} initial="initial" animate="animate" exit="exit">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'nowa-piosenka', label: 'NOWA PIOSENKA' },
              { id: 'dyskolgrafia', label: 'DYSKOGRAFIA' },
              { id: 'o-mnie', label: 'O MNIE' },
              { id: 'merch', label: 'MERCH' },
              { id: 'kontakt', label: 'KONTAKT' }
            ].map((item) => (
              <motion.div key={item.id} variants={linkItemVariants} className="menu-link-wrapper">
                <a onClick={() => handleLinkClick(item.id)} className="menu-link">
                  {item.label}
                </a><br />
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </div>
    </motion.div>
  );
}

export default MenuOverlay;