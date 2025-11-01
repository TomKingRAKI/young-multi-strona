// Plik: /src/components/NewSong/NewSong.jsx

import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './NewSong.css';
// ZMIANA: Importujemy Gramophone
import Gramophone from '../Gramophone/Gramophone';

const NewSong = forwardRef((props, ref) => {
  
  const scrollRef = useRef(null);

  // Animacja 1: Radius (bez zmian)
  const { scrollYProgress: radiusProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start start"] 
  });
  const radius = useTransform(
    radiusProgress,
    [0, 1], 
    ["100px", "0px"]
  );

  // Animacja 2: Wewnętrzna (bez zmian)
  const { scrollYProgress: contentProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"] 
  });

  // Logika napisów (bez zmian)
  const textOpacity = useTransform(contentProgress, [0.05, 0.15], [0, 1]);
  const textY = useTransform(contentProgress, [0.2, 0.4], ["0vh", "-30vh"]);

  // Logika wideo (bez zmian)
  const videoY = useTransform(contentProgress, [0.2, 0.4], ["100vh", "10vh"]);
  const videoScale = useTransform(contentProgress, [0.4, 0.6], [1, 0.7]);
  const videoX = useTransform(contentProgress, [0.4, 0.6], ["0%", "-25%"]);

  // Logika linków (bez zmian)
  const linksOpacity = useTransform(contentProgress, [0.55, 0.7], [0, 1]);
  const linksX = useTransform(contentProgress, [0.55, 0.7], ["300vw", "100%"]);
  const linksY = useTransform(contentProgress, [0.4, 0.6], ["0vh", "10vh"]);

  // --- ZMIANA: NOWA ANIMACJA "POCIĄGU" (TAŚMY) ---
  const trackX = useTransform(
    contentProgress,
    [0.7, 1.0], // Używamy ostatnie 30% scrolla
    ["0%", "-100%"] // Przesuń z (Wagon 1) na (Wagon 2)
  );
  // -----------------------------------------------------------


  return (
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
      
      {/* ZMIANA: "POCIĄG" animowany przez 'trackX' */}
      <motion.div 
        className="newsong-sticky-content"
        style={{
          x: trackX 
        }}
      >
        
        {/* ZMIANA: "WAGON 1" - NOWY PANEL
           (Ten div "opakowuje" całą starą zawartość)
        */}
        <motion.div 
          className="newsong-panel"
          style={{
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius
          }}
        >
          {/* Cała dotychczasowa zawartość idzie TUTAJ */}
          <motion.div 
            className="newsong-text-wrapper" 
            style={{ opacity: textOpacity, y: textY }}
          >
            <h1 className="newsong-title">GDZIE MOJ DOM</h1>
            <h2 className="newsong-subtitle">OUT NOW</h2>
          </motion.div>
          
          <motion.div 
            className="video-container" 
            style={{ opacity: 1, y: videoY, x: videoX, scale: videoScale }}
          >
            <div className="video-placeholder">VIDEO</div>
          </motion.div>

          <motion.div 
            className="links-container" 
            style={{ opacity: linksOpacity, x: linksX, y: linksY }}
          >
            <a href="#" className="streaming-link" target="_blank">SPOTIFY</a>
            <a href="#" className="streaming-link" target="_blank">APPLE MUSIC</a>
            <a href="#" className="streaming-link" target="_blank">YOUTUBE MUSIC</a>
            <a href="#" className="streaming-link" target="_blank">TIDAL</a>
          </motion.div>
        </motion.div> 
        {/* Koniec "Wagonu 1" */}


        {/* ZMIANA: "WAGON 2" */}
        <Gramophone />
        {/* Koniec "Wagonu 2" */}
        
      </motion.div> 
      {/* Koniec "Pociągu" */}

    </motion.section>
  );
});

export default NewSong;