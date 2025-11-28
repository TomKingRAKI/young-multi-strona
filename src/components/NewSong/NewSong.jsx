import React, { useRef, forwardRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  useMotionValue
} from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';
import About from '../About/About';
import SmokeTransition from '../SmokeTransition/SmokeTransition';

// Importy placeholderów (jeśli używasz)
// import previewVideo from '../../assets/preview-loop.mp4'; 

const NewSong = forwardRef((props, ref) => {
  const scrollRef = useRef(null);
  const previousThemeRef = useRef(null);

  // === 1. PRZYGOTOWANIE DO CELOWANIA (SNAJPER) ===
  // Tworzymy Ref, który przekażemy do Gramophone, żeby namierzyć ten mały div
  const zoomTargetRef = useRef(null);

  // Domyślne wartości (startujemy od Twojego starego ustawienia jako fallback)
  // 50% szerokości (0.5) i 78% wysokości (0.78)
  const originX = useMotionValue(0.5);
  const originY = useMotionValue(0.78);

  // Dynamiczny szablon CSS, który łączy X i Y w jeden string np. "50.5% 78.2%"
  const calculatedOrigin = useMotionTemplate`${useTransform(originX, x => x * 100)}% ${useTransform(originY, y => y * 100)}%`;


  // --- RESPANSYWNOŚĆ (Mobile Check) ---
  const [isMobile, setIsMobile] = useState(false); // Domyślnie false, useEffect ustawi
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // === LOGIKA LATARKI (SPOTLIGHT) ===
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(40);
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, 
    rgba(255, 255, 255, 0.03) 0%, 
    rgba(0, 0, 0, 0.9) 40%, 
    rgba(20, 0, 0, 0.4) 100%)`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);


  // --- GŁÓWNE ANIMACJE SCROLLA ---
  const { scrollYProgress: contentProgress } = useScroll({
    target: scrollRef, offset: ["start start", "end end"]
  });

  // Logika zmiany motywu (Header)
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

    // === 2. LOGIKA CELOWANIA (NAMIERZANIE) ===
    // Namierzamy cel, ZANIM zacznie się zoom (zoom startuje ok 0.65).
    // Dzięki temu kamera ustawia się na wprost celu i wjazd jest prosty (------), a nie ukośny (\).
    if (latest > 0.55 && latest < 0.64 && zoomTargetRef.current) {
      const rect = zoomTargetRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Obliczamy środek w pikselach
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // === TU REGULUJESZ CELOWNIK ===

      const OFFSET_X = 0.01; // <--- ZWIĘKSZ, żeby przesunąć W PRAWO (np. 0.03, 0.05)
      const OFFSET_Y = 0.1; // <--- To Twoje ustawienie W DÓŁ

      // Dodajemy offsety do wyniku
      const newX = (centerX / windowWidth) + OFFSET_X;
      const newY = (centerY / windowHeight) + OFFSET_Y;

      originX.set(newX);
      originY.set(newY);
    }
  });


  // --- SEKWENCJA RUCHU ---
  // 1. Tekst
  const textY = useTransform(contentProgress, [0, 0.07], ["0vh", isMobile ? "-18vh" : "-25vh"]);

  // 2. Wideo
  const videoY = useTransform(contentProgress, [0, 0.07], ["100vh", isMobile ? "0vh" : "15vh"]);
  const videoScale = useTransform(contentProgress, [0.08, 0.12], [1, 0.9]);
  const videoX = useTransform(contentProgress, [0.08, 0.12], ["0%", isMobile ? "0%" : "-40%"]);

  // 3. Linki
  const linksOpacity = useTransform(contentProgress, [0.13, 0.18], [0, 1]);
  const linksX = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["0%", "0%"] : ["50vw", "15vw"]);
  const linksY = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["80vh", "30vh"] : ["15vh", "15vh"]);

  // 4. Pociąg odjeżdża
  const trackX = useTransform(contentProgress, [0.20, 0.24, 0.35, 1.0], ["0%", "0%", "-50%", "-50%"]);

  // --- GRAMOPHONE & ABOUT & SMOKE ---
  const gramophoneZoomProgress = useTransform(contentProgress, [0.65, 0.85], [0, 1]);
  const gramophoneScale = useTransform(gramophoneZoomProgress, [0, 1], [1, 15]);

  // UWAGA: Tutaj usunąłem stare `gramophoneTransformOrigin`, bo teraz używamy `calculatedOrigin`
  // wyliczanego na żywo w sekcji "Logika Celowania".

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

            {/* TŁO INDUSTRIAL */}
            <div className="industrial-bg">
              <div className="noise-overlay"></div>
              <div className="grid-overlay"></div>
              <motion.div
                className="spotlight"
                style={{ background: spotlightBackground }}
              />
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
              {/* Tu wklej swoje prawdziwe linki w cudzysłowiu */}
              <PlatformLink
                name="SPOTIFY"
                url="https://open.spotify.com/album/3ex3T8zjsgKoSP9ajrXv2l"
              />
              <PlatformLink
                name="APPLE MUSIC"
                url="https://music.apple.com/us/album/gdzie-m%C3%B3j-dom-single/1845163826"
              />
              <PlatformLink
                name="YOUTUBE MUSIC"
                url="https://music.youtube.com/playlist?list=OLAK5uy_mvis9FVMPeX96gbKtOFgWsjlooaX5ty_M"
              />
              <PlatformLink
                name="TIDAL"
                url="http://www.tidal.com/album/463841952"
              />
            </motion.div>

          </div>

          {/* PANEL 2: GRAMOPHONE */}
          {/* Tu przekazujemy ref i obliczony origin */}
          <Gramophone
            contentProgress={contentProgress}
            isMenuOpen={props.isMenuOpen}
            zoomTargetRef={zoomTargetRef} // <--- PRZEKAZUJEMY SNAJPERA
            style={{
              scale: gramophoneScale,
              transformOrigin: calculatedOrigin // <--- TUTAJ WPADA OBLICZONA POZYCJA (np. 50.5% 78.2%)
            }}
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

const PlatformLink = ({ name, url }) => (
  <a href={url} className="streaming-link" target="_blank" rel="noopener noreferrer">
    <span>{name}</span>
    <span className="link-arrow">↗</span>
  </a>
);

export default NewSong;