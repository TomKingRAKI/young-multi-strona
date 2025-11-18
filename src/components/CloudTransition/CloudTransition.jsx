// Plik: /src/components/CloudTransition/CloudTransition.jsx

import React from 'react';
import { motion, useTransform } from 'framer-motion';
import './CloudTransition.css';
import cloudImage from '../../assets/cloud-edge.png'; 

const CloudTransition = ({ progress }) => {
  // Animacje bloków (to jest OK)
  const leftBlockX = useTransform(progress, [0, 1], ['-200%', '0%']);
  const rightBlockX = useTransform(progress, [0, 1], ['200%', '0%']);

  // Widoczność (to jest OK)
  const containerOpacity = useTransform(progress, [0, 0.05], [0, 1]);
  const containerPointerEvents = useTransform(progress, (v) => 
    v > 0.01 ? 'auto' : 'none'
  );

  return (
    <motion.div 
      className="cloud-transition-container"
      style={{
        opacity: containerOpacity,
        pointerEvents: containerPointerEvents
      }}
    >
      {/* Lewy Biały Blok (Panel) */}
      <motion.div 
        className="white-block" // Nadal używamy tej klasy
        style={{ 
          x: leftBlockX, // Animujemy tylko rodzica
          left: 0,
        }}
      >
        {/* KROK 1: Obrazek nie ma już 'style' */}
        <motion.img
          src={cloudImage}
          alt="Chmura"
          // Używamy DWÓCH klas do precyzyjnego stylowania w CSS
          className="cloud-image cloud-image-left" 
        />
      </motion.div>
      
      {/* Prawy Biały Blok (Panel) */}
      <motion.div 
        className="white-block" // Ta sama klasa
        style={{ 
          x: rightBlockX, // Animujemy tylko rodzica
          right: 0,
        }}
      >
        {/* KROK 2: Ten obrazek też nie ma 'style' */}
        <motion.img
          src={cloudImage}
          alt="Chmura"
          className="cloud-image cloud-image-right"
        />
      </motion.div>
    </motion.div>
  );
};

export default CloudTransition;