// Plik: /src/components/NewSong/NewSong.jsx

// Usunęliśmy 'useEffect' z importu
import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';
import LiquidEther from '../LiquidEther/LiquidEther';

// Komponent nie przyjmuje już 'setThemeOverride'
const NewSong = forwardRef((props, ref) => {
  
  const scrollRef = useRef(null);
  // OPTYMALIZACJA: Śledzimy poprzedni motyw, aby uniknąć niepotrzebnych aktualizacji
  const previousThemeRef = useRef(null);

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
  
  // OPTYMALIZACJA: Aktualizujemy tylko gdy motyw rzeczywiście się zmienia
  useMotionValueEvent(contentProgress, "change", (latest) => {
    // W 'trackX' zdefiniowałeś, że pociąg rusza przy 0.47
    // Gramophone (jasne tło) zaczyna się wtedy wsuwać.
    
    // Użyjemy 0.56 jako punktu "w połowie drogi"
    // (0.47 + 0.65) / 2 = 0.56
    
    if (typeof props.setHeaderTheme === 'function') {
      // Gdy latest jest bardzo mały (< 0.05), jesteśmy jeszcze przed NewSong
      // Resetujemy previousThemeRef, żeby przy następnym scrollu do NewSong motyw się zaktualizował
      if (latest < 0.05) {
        previousThemeRef.current = null; // Resetujemy, żeby wymusić aktualizację przy następnym scrollu
        return; // Nie aktualizujemy motywu gdy jesteśmy przed NewSong
      }
      
      const newTheme = latest > 0.56 ? 'dark' : 'light';
      // Aktualizujemy tylko gdy motyw się zmienił
      if (previousThemeRef.current !== newTheme) {
        previousThemeRef.current = newTheme;
        props.setHeaderTheme(newTheme);
      }
    }
  });

  // --- SEKWENCJA "POŚRODKU" (STABILNA) ---

  // 1. Tekst
  const textOpacity = useTransform(contentProgress, [0.05, 0.13], [0, 1]);
  const textY = useTransform(contentProgress, [0.10, 0.20], ["0vh", "-30vh"]); 

  // 2. Wideo Wjeżdża
  const videoY = useTransform(contentProgress, [0.10, 0.20], ["100vh", "10vh"]);

  // 3. Pauza dla Wideo
  const videoScale = useTransform(
    contentProgress,
    [0.20, 0.25, 0.35], 
    [1, 1, 0.7]       
  );
  const videoX = useTransform(
    contentProgress,
    [0.20, 0.25, 0.35],
    ["0%", "0%", "-25%"] 
  );

  // 4. Linki 
  const linksOpacity = useTransform(
    contentProgress,
    [0.35, 0.42],       
    [0, 1]
  );
  const linksX = useTransform(
    contentProgress,
    [0.35, 0.42],       
    ["300vw", "100%"]
  );
  const linksY = useTransform(
    contentProgress,
    [0.35, 0.42],       
    ["10vh", "10vh"]   
  );

  // 5. Animacja "Pociągu" (trackX) Z PAUZĄ
  const trackX = useTransform(
    contentProgress,
    [0.42, 0.47, 0.65, 1.0],  // Dodaliśmy punkt '0.8'
    ["0%", "0%", "-50%", "-50%"] // Pociąg dojeżdża do -50% i tam zostaje
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

          <LiquidEther
            className="newsong-liquid-background" // Dajemy mu klasę do stylowania
            colors={[ '#ffffffff', '#e4e4e4ff', '#cacacaff' ]} // Kolory z Twojego przykładu
            mouseForce={13}
            cursorSize={65}
            isViscous={false}
            autoDemo={true}      // Niech sam się porusza
            autoSpeed={0.5}
            autoIntensity={2.2}
          />
          {/* Cała dotychczasowa zawartość idzie TUTAJ */}
          <motion.div 
            className="newsong-text-wrapper" 
            initial={{ opacity: 0, y: 20 }} // Start: niewidoczny i lekko na dole
            whileInView={{ opacity: 1, y: 0 }} // Koniec: widoczny na swojej pozycji
            viewport={{ once: true, margin: "-200px" }} // Odpal raz, 200px przed wejściem
            transition={{ duration: 0.8 }} // Czas trwania animacji wjazdu
            style={{ y: textY }}
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

        <Gramophone 
          contentProgress={contentProgress} 
          isMenuOpen={props.isMenuOpen} 
        />
        {/* Koniec "Wagonu 2" */}
        
      </motion.div> 
      {/* Koniec "Pociągu" */}

    </motion.section>
  );
});

export default NewSong;