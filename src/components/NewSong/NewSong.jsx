// Plik: /src/components/NewSong/NewSong.jsx

import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './NewSong.css';

const NewSong = forwardRef((props, ref) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    
    // ZMIANA: Zmieniamy 'end center' na 'start start'
    //
    // Stary offset: ["start end", "end center"]
    // (Animacja kończyła się, gdy DÓŁ sekcji był w ŚRODKU ekranu - źle!)
    //
    // Nowy offset: ["start end", "start start"]
    // (Animacja zaczyna się, gdy GÓRA sekcji jest na DOLE ekranu
    // i kończy, gdy GÓRA sekcji jest na GÓRZE ekranu - idealnie!)
    offset: ["start end", "start start"]
  });

  // Ta transformacja jest już poprawna
  const radius = useTransform(
    scrollYProgress,
    [0, 1], // Od 0% do 100% postępu animacji
    ["100px", "0px"] // Zmień radius z 40px na 0px
  );

  return (
    <motion.section 
      ref={(node) => {
        sectionRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="newsong-section"
      style={{
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius
      }}
    >
      <div className="newsong-content">
        <h1>Nowa Piosenka</h1>
      </div>
    </motion.section>
  );
});

export default NewSong;