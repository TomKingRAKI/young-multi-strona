// Plik: /src/components/NewSong/NewSong.jsx

// Usunęliśmy 'useEffect' z importu
import React, { useRef, forwardRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';
import LiquidEther from '../LiquidEther/LiquidEther';
import About from '../About/About';
import CloudTransition from '../CloudTransition/CloudTransition';

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
  const textOpacity = useTransform(contentProgress, [0.05, 0.10], [0, 1]); // Szybciej
  const textY = useTransform(contentProgress, [0.02, 0.08], ["0vh", "-30vh"]); // Szybciej i startuje wcześniej

  // 2. Wideo Wjeżdża
  const videoY = useTransform(contentProgress, [0.02, 0.08], ["100vh", "10vh"]); // Szybciej, razem z tekstem

  // 3. Pauza dla Wideo
  const videoScale = useTransform(
    contentProgress,
    [0.08, 0.10, 0.15], // Wcześniej, krótsza pauza, szybsza animacja
    [1, 1, 0.7]
  );
  const videoX = useTransform(
    contentProgress,
    [0.08, 0.10, 0.15], // Wcześniej, krótsza pauza, szybsza animacja
    ["0%", "0%", "-25%"]
  );

  // 4. Linki 
  const linksOpacity = useTransform(
    contentProgress,
    [0.15, 0.20],       // Wcześniej i szybciej
    [0, 1]
  );
  const linksX = useTransform(
    contentProgress,
    [0.15, 0.20],       // Wcześniej i szybciej
    ["300vw", "100%"]
  );
  const linksY = useTransform(
    contentProgress,
    [0.15, 0.20],       // Wcześniej i szybciej
    ["10vh", "10vh"]
  );

  // 5. Animacja "Pociągu" (trackX) Z PAUZĄ
  const trackX = useTransform(
    contentProgress,
    [0.20, 0.24, 0.35, 1.0],  // Wcześniej, krótsza pauza, szybsza animacja
    ["0%", "0%", "-50%", "-50%"]
  );
  // -----------------------------------------------------------

  // ZMIANA: Logika zoomu przeniesiona tutaj, aby skalować całą sekcję Gramophone
  const gramophoneZoomProgress = useTransform(
    contentProgress,
    [0.64, 0.8], 
    [0, 1]
  );

  const gramophoneScale = useTransform(gramophoneZoomProgress, [0, 1], [1, 15]);
  const gramophoneTransformOrigin = useTransform(
    gramophoneZoomProgress,
    [0, 1],
    ["50% 78%", "50% 78%"] // Zaczyna od środka, kończy niżej (na karcie)
  );

  const aboutClipPath = useTransform(
    gramophoneZoomProgress, // Używamy progressu zoomu (0 -> 1)
    [0.05, 1], // Od początku do końca zoomu
    [
        "circle(0% at 50% 62%)", 
        "circle(150% at 50% 0%)" // Kończy jako gigantyczne kółko (150%) w tym samym punkcie
    ]
  );
  
  const aboutOpacity = useTransform(
    gramophoneZoomProgress,
    [0, 0.001], // Jak tylko zoom się ruszy (0 -> 0.001)
    [0, 1]       // Natychmiast "włącz" opacity
  );

// Sprawiamy, że sekcja About jest klikalna tylko gdy jest widoczna
const aboutPointerEvents = useTransform(gramophoneZoomProgress, (v) => (v > 0.1 ? 'auto' : 'none'));

const cloudProgress = useTransform(
    contentProgress,
    [0.8, 1.0], // Używamy ostatnie 10% scrolla
    [0, 1]      // na animację chmur (0 -> 1)
  );


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
      <div style={{ 
      position: 'sticky', 
      top: 0, 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden' 
    }}>
      
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
          // ZMIANA: Przekazujemy nowe wartości jako propsy
          zoomScale={gramophoneScale}
          zoomOrigin={gramophoneTransformOrigin}
          style={{
            scale: gramophoneScale,
            transformOrigin: gramophoneTransformOrigin,
          }}
        />
        {/* Koniec "Wagonu 2" */}
        
      </motion.div> 
      {/* Koniec "Pociągu" */}
      <motion.div 
      className="newsong-about-layer"
      style={{
        opacity: aboutOpacity,
        clipPath: aboutClipPath,
        pointerEvents: aboutPointerEvents
      }}
    >
      {/* Przekazujemy mu nasze opacity, żeby nadpisać jego logikę */}
      <About externalOpacity={aboutOpacity} />
    </motion.div>
    <CloudTransition progress={cloudProgress} />
      </div>
    </motion.section>
  );
});

export default NewSong;