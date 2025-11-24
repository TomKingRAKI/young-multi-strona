import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';
import About from '../About/About';
import SmokeTransition from '../SmokeTransition/SmokeTransition';

// Importy placeholderów (podmień na swoje pliki!)
// import previewVideo from '../../assets/preview-loop.mp4'; 
// import thumbImg from '../../assets/thumb.jpg'; 

const NewSong = forwardRef((props, ref) => {
  const scrollRef = useRef(null);
  const previousThemeRef = useRef(null);

  // --- RESPANSYWNOŚĆ (Mobile Check) ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- ANIMACJE (Bez zmian logicznych, tylko dostosowanie) ---
  const { scrollYProgress: radiusProgress } = useScroll({
    target: scrollRef, offset: ["start end", "start start"]
  });
  const radius = useTransform(radiusProgress, [0, 1], ["20px", "0px"]); // Ostre rogi pasują bardziej do industrialu!

  const { scrollYProgress: contentProgress } = useScroll({
    target: scrollRef, offset: ["start start", "end end"]
  });

  // Logika zmiany motywu (header)
  useMotionValueEvent(contentProgress, "change", (latest) => {
    if (typeof props.setHeaderTheme === 'function') {
      if (latest < 0.05) {
        previousThemeRef.current = null;
        return;
      }
      const newTheme = latest > 0.75 ? 'dark' : 'light';
      if (previousThemeRef.current !== newTheme) {
        previousThemeRef.current = newTheme;
        props.setHeaderTheme(newTheme);
      }
    }
  });

  // --- SEKWENCJA RUCHU ---
  // 1. Tekst
  // Na mobile tekst przesuwa się mniej drastycznie, żeby nie wjeżdżał na header
  const textY = useTransform(contentProgress, [0, 0.07], ["0vh", isMobile ? "-18vh" : "-25vh"]);

  // 2. Wideo
  // Desktop: Startuje z dołu (100vh) -> 15vh
  // Mobile: Startuje z dołu (50vh) -> 10vh (żeby było bliżej tytułu)
  const videoY = useTransform(contentProgress, [0, 0.07], ["100vh", isMobile ? "0vh" : "15vh"]);

  const videoScale = useTransform(contentProgress, [0.08, 0.12], [1, 0.9]);

  // Desktop: Wideo zjeżdża w lewo (-40%)
  // Mobile: Wideo zostaje na środku (0%) - bo linki będą POD spodem
  const videoX = useTransform(contentProgress, [0.08, 0.12], ["0%", isMobile ? "0%" : "-40%"]);

  // 3. Linki
  const linksOpacity = useTransform(contentProgress, [0.13, 0.18], [0, 1]);

  // X: 
  // Desktop: Wjeżdżają z prawej (50vw -> 15vw)
  // Mobile: Są wycentrowane (0vw -> 0vw)
  const linksX = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["10vw", "0vw"] : ["30vw", "30vw"]);

  // Y:
  // Desktop: 15vh (obok wideo)
  // Mobile: 55vh (POD wideo)
  const linksY = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["55vh", "30vh"] : ["0vh", "0vh"]);

  // 5. Pociąg odjeżdża
  const trackX = useTransform(contentProgress, [0.20, 0.24, 0.35, 1.0], ["0%", "0%", "-50%", "-50%"]);

  // --- RESZTA (Gramophone, About, Smoke) - BEZ ZMIAN ---
  const gramophoneZoomProgress = useTransform(contentProgress, [0.65, 0.85], [0, 1]);
  const gramophoneScale = useTransform(gramophoneZoomProgress, [0, 1], [1, 15]);
  const gramophoneTransformOrigin = useTransform(gramophoneZoomProgress, [0, 1], ["50% 78%", "50% 78%"]);
  const aboutClipPath = useTransform(gramophoneZoomProgress, [0.05, 1], ["circle(0% at 50% 62%)", "circle(150% at 50% 0%)"]);
  const aboutOpacity = useTransform(gramophoneZoomProgress, [0, 0.001], [0, 1]);
  const aboutPointerEvents = useTransform(gramophoneZoomProgress, (v) => (v > 0.1 ? 'auto' : 'none'));
  const cloudProgress = useTransform(contentProgress, [0.85, 1.0], [0, 1]);
  const smokeZIndex = useTransform(contentProgress, [0, 0.8, 0.81, 1], [0, 0, 100, 100]);
  const smokeOpacity = useTransform(contentProgress, [0.7, 0.8], [0, 1]);

  return (
    <motion.section
      id="nowa-piosenka"
      ref={(node) => {
        scrollRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="newsong-section"
    >
      <div className="newsong-sticky-viewport">

        <motion.div className="newsong-train-track" style={{ x: trackX }}>

          {/* PANEL 1: NEW SONG */}
          <div className="newsong-panel">

            {/* --- NOWE TŁO (Industrial) --- */}
            <div className="industrial-bg">
              <div className="noise-overlay"></div>
              <div className="grid-overlay"></div>
              <div className="spotlight"></div>
            </div>

            {/* TYTUŁ */}
            <motion.div
              className="newsong-text-wrapper"
              style={{ y: textY }}
            >
              <h1 className="newsong-title">GDZIE MOJ DOM</h1>
              <h2 className="newsong-subtitle">OUT NOW • STREAMING EVERYWHERE</h2>
            </motion.div>

            {/* WIDEO */}
            <motion.div
              className="video-container"
              style={{ y: videoY, x: videoX, scale: videoScale }}
              onClick={() => window.open('https://www.youtube.com/watch?v=A0I1MrojmJE&list=RDA0I1MrojmJE&start_radio=1', '_blank')}
            >
              {/* Ozdobniki techniczne */}
              <div className="tech-corner tl"></div>
              <div className="tech-corner br"></div>
              <div className="rec-label">● REC</div>

              <div className="video-thumbnail-wrapper">
                <img
                  src="https://img.youtube.com/vi/A0I1MrojmJE/maxresdefault.jpg"
                  className="video-thumb-img"
                  alt="Thumbnail"
                />
                <video
                  src="/assets/preview-loop.mp4"
                  className="video-preview-loop"
                  muted loop autoPlay playsInline
                />
                <div className="play-button">
                  <div className="play-icon"></div>
                </div>
              </div>
            </motion.div>

            {/* LINKI */}
            <motion.div
              className="links-container"
              style={{ opacity: linksOpacity, x: linksX, y: linksY }}
            >
              <PlatformLink name="SPOTIFY" />
              <PlatformLink name="APPLE MUSIC" />
              <PlatformLink name="YOUTUBE MUSIC" />
              <PlatformLink name="TIDAL" />
            </motion.div>

          </div>

          {/* PANEL 2: GRAMOPHONE */}
          <Gramophone
            contentProgress={contentProgress}
            isMenuOpen={props.isMenuOpen}
            zoomScale={gramophoneScale}
            zoomOrigin={gramophoneTransformOrigin}
            style={{ scale: gramophoneScale, transformOrigin: gramophoneTransformOrigin }}
          />
        </motion.div>

        {/* WARSTWY DODATKOWE (About, Smoke) */}
        <motion.div
          className="newsong-about-layer"
          style={{ opacity: aboutOpacity, clipPath: aboutClipPath, pointerEvents: aboutPointerEvents }}
        >
          <About externalOpacity={aboutOpacity} />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: smokeZIndex, opacity: smokeOpacity, mixBlendMode: 'screen'
          }}
        >
          <SmokeTransition progress={cloudProgress} />
        </motion.div>

      </div>
    </motion.section>
  );
});

const PlatformLink = ({ name }) => (
  <a href="#" className="streaming-link" target="_blank">
    <span>{name}</span>
    <span className="link-arrow">↗</span>
  </a>
);

export default NewSong;