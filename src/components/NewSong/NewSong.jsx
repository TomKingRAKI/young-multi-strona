// Plik: /src/components/NewSong/NewSong.jsx

// Usunęliśmy 'useEffect' z importu
import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';

// Komponent nie przyjmuje już 'setThemeOverride'
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

  // --- SEKWENCJA "POŚRODKU" (STABILNA) ---

  // 1. Tekst
  const textOpacity = useTransform(contentProgress, [0.05, 0.13], [0, 1]);
  const textY = useTransform(contentProgress, [0.13, 0.32], ["0vh", "-30vh"]); 

  // 2. Wideo Wjeżdża
  const videoY = useTransform(contentProgress, [0.13, 0.32], ["100vh", "10vh"]);

  // 3. Pauza dla Wideo
  const videoScale = useTransform(
    contentProgress,
    [0.32, 0.38, 0.52], 
    [1, 1, 0.7]       
  );
  const videoX = useTransform(
    contentProgress,
    [0.32, 0.38, 0.52], 
    ["0%", "0%", "-25%"] 
  );

  // 4. Linki 
  const linksOpacity = useTransform(
    contentProgress,
    [0.52, 0.58],       
    [0, 1]
  );
  const linksX = useTransform(
    contentProgress,
    [0.52, 0.58],       
    ["300vw", "100%"]
  );
  const linksY = useTransform(
    contentProgress,
    [0.52, 0.58],       
    ["10vh", "10vh"]   
  );

  // 5. Animacja "Pociągu" (trackX) Z PAUZĄ
  const trackX = useTransform(
    contentProgress,
    [0.58, 0.65, 1.0],  
    ["0%", "0%", "-50%"] 
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
      
      <motion.div 
        className="newsong-sticky-content"
        style={{
          x: trackX 
        }}
      >
        
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

        <Gramophone />
        {/* Koniec "Wagonu 2" */}
        
      </motion.div> 
      {/* Koniec "Pociągu" */}

    </motion.section>
  );
});

export default NewSong;