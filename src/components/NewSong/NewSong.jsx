// Plik: /src/components/NewSong/NewSong.jsx

import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './NewSong.css';

const NewSong = forwardRef((props, ref) => {
  
  const scrollRef = useRef(null);

  // --- ANIMACJA 1: Zaokrąglone rogi ---
  const { scrollYProgress: radiusProgress } = useScroll({
    target: scrollRef,
    
    // ZMIANA 1: NAPRAWIONY OFFSET!
    // Animacja dzieje się szybko, na pierwszych 20% wjazdu
    offset: ["start end", "start start"] 
  });

  // Przekształcamy postęp (0 do 1) na radius (100px to 0px)
  const radius = useTransform(
    radiusProgress,
    [0, 1], 
    ["100px", "0px"] // Zostawiłem 100px, które ustawiłeś
  );
  // -----------------------------------------------------------


  // --- ANIMACJA 2: Wewnętrzna (NOWA LOGIKA) ---
  const { scrollYProgress: contentProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"] 
  });

  // --- ZMIANA: NOWA LOGIKA NAPISU ---
  // 1. Napis pojawia się na początku
  const textOpacity = useTransform(
    contentProgress, 
    [0.05, 0.15], 
    [0, 1]
  );
  // 2. Napis jest "przepychany" do góry, gdy wideo wjeżdża
  const textY = useTransform(
    contentProgress,
    [0.2, 0.4], // Kiedy wideo wjeżdża
    ["0vh", "-30vh"] // Przesuń ze środka (0vh) na górę (-40vh)
  );

  // --- ZMIANA: NOWA LOGIKA WIDEO ---
  // 1. Wideo wjeżdża z dołu, pchając napis
  const videoY = useTransform(
    contentProgress,
    [0.2, 0.4], // W tym samym czasie co pchanie tekstu
    ["100vh", "10vh"] // Wjedź z dołu (100vh) na środek (0vh)
  );
  // 2. Wideo się zmniejsza
  const videoScale = useTransform(
    contentProgress,
    [0.4, 0.6], // Zaraz po dojechaniu na środek
    [1, 0.7]
  );
  // 3. Wideo idzie na PRAWO (tak jak prosiłeś)
  const videoX = useTransform(
    contentProgress,
    [0.4, 0.6],
    ["0%", "-25%"] // Przesuń ze środka (0%) na prawo (25%)
  );

  // --- ZMIANA: NOWA LOGIKA LINKÓW ---
  // 1. Linki pojawiają się, gdy wideo się przesuwa
  const linksOpacity = useTransform(
    contentProgress,
    [0.55, 0.7],
    [0, 1]
  );
  // 2. Linki wjeżdżają z LEWEJ strony (żeby wypełnić lukę)
  const linksX = useTransform(
    contentProgress,
    [0.55, 0.7],
    ["300vw", "100%"] // Wjedź zza lewej krawędzi
  );

  const linksY = useTransform(
    contentProgress,
    [0.4, 0.6], // Użyj tego samego czasu co wideo
    ["0vh", "10vh"] // Przesuń się z środka na 15% poniżej
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
      
      {/* "Lepki" kontener */}
      <motion.div 
        className="newsong-sticky-content"
        style={{
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius
        }}
      >
        
        {/* === ELEMENTY ANIMACJI === */}

        {/* 1. Tekst (teraz ma 'y' i 'opacity') */}
        <motion.div 
          className="newsong-text-wrapper" 
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="newsong-title">GDZIE MOJ DOM</h1>
          <h2 className="newsong-subtitle">OUT NOW</h2>
        </motion.div>
        
        {/* 2. Wideo (teraz ma 'y', 'x' i 'scale') */}
        <motion.div 
          className="video-container" 
          style={{ 
            opacity: 1, // ZMIANA: Opacity jest teraz stałe (wjeżdża z dołu)
            y: videoY,
            x: videoX, 
            scale: videoScale 
          }}
        >
          <div className="video-placeholder">VIDEO</div>
        </motion.div>

        {/* 3. Linki (teraz mają 'x' i 'opacity') */}
        <motion.div 
          className="links-container" 
          style={{ 
            opacity: linksOpacity, 
            x: linksX,
            y: linksY
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