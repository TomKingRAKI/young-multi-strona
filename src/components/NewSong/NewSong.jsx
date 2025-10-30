// Plik: /src/components/NewSong/NewSong.jsx

import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './NewSong.css';

const NewSong = forwardRef((props, ref) => {
  
  const scrollRef = useRef(null);

  // --- ANIMACJA 1: Zaokrąglone rogi ---
  const { scrollYProgress: radiusProgress } = useScroll({
    target: scrollRef,
    
    // ZMIANA 1: POPRAWIONY OFFSET!
    // Animacja dzieje się szybko, na pierwszych 20% wjazdu
    offset: ["start end", "start start"] 
  });

  // Przekształcamy postęp (0 do 1) na radius (40px do 0px)
  const radius = useTransform(
    radiusProgress,
    [0, 1], 
    ["100px", "0px"]
  );
  // -----------------------------------------------------------


  // --- ANIMACJA 2: Wewnętrzna (Tekst i Wideo) ---
  const { scrollYProgress: contentProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"] 
  });

  // Animacje tekstu i wideo (bez zmian)
  const textOpacity = useTransform(contentProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
  const textY = useTransform(contentProgress, [0.05, 0.15], ["20px", "0px"]);
  const videoOpacity = useTransform(contentProgress, [0.25, 0.35, 0.8], [0, 1, 1]);
  const videoX = useTransform(contentProgress, [0.4, 0.6], ["0%", "-25%"]);
  const videoScale = useTransform(contentProgress, [0.4, 0.6], [1, 0.7]);
  // -----------------------------------------------------------
  const linksOpacity = useTransform(
    contentProgress,
    [0.55, 0.7], // Startują, gdy wideo jest w połowie ruchu
    [0, 1]
  );
  // Wjeżdżają z prawej (startują z 50px, kończą na 25% w prawo)
  const linksX = useTransform(
    contentProgress,
    [0.55, 0.7],
    ["250vw", "100%"] 
  );

  return (
    // ZMIANA 2: Zewnętrzna sekcja jest znowu STATYCZNA
    // Nie potrzebuje 'motion' ani 'style'
    <motion.section 
      ref={(node) => {
        scrollRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }} 
      className="newsong-section"
      style={{
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius
      }}
    >
      
      {/* "Lepki" kontener */}
      {/* ZMIANA 3: Animacja rogów jest TYLKO TUTAJ */}
      <motion.div 
        className="newsong-sticky-content"
        style={{
          borderTopLeftRadius: radius, // Podpinamy animowany radius
          borderTopRightRadius: radius // Podpinamy animowany radius
        }}
      >
        
        {/* Reszta kodu (Tekst i Wideo) zostaje bez zmian */}
        <motion.div 
          className="newsong-text-wrapper" 
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="newsong-title">GDZIE MOJ DOM</h1>
          <h2 className="newsong-subtitle">OUT NOW</h2>
        </motion.div>
        
        <motion.div 
          className="video-container" 
          style={{ opacity: videoOpacity, x: videoX, scale: videoScale }}
        >
          <div className="video-placeholder">VIDEO</div>
        </motion.div>

        <motion.div 
          className="links-container" 
          style={{ 
            opacity: linksOpacity, 
            x: linksX 
          }}
        >
          <a href="#" className="streaming-link" target="_blank">SPOTIFY</a>
          <a href="#" className="streaming-link" target="_blank">APPLE MUSIC</a>
          <a href="#" className="streaming-link" target="_blank">YOUTUBE MUSIC</a>
          <a href="#" className="streaming-link" target="_blank">TIDAL</a>
        </motion.div>
        
      </motion.div>
    </motion.section>
  );
});

export default NewSong;