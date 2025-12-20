import React, { useRef, forwardRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  useMotionValue,
  animate
} from 'framer-motion';
import './NewSong.css';
import Gramophone from '../Gramophone/Gramophone';
import About from '../About/About';
import SmokeTransition from '../SmokeTransition/SmokeTransition';

const NewSong = forwardRef((props, ref) => {
  const scrollRef = useRef(null);
  const previousThemeRef = useRef(null);

  // === SNAJPER ===
  const zoomTargetRef = useRef(null);
  // Stabilizacja: Zakładamy, że celownik jest ZAWSZE na środku ekranu (0.5, 0.5).
  // Dynamiczne mierzenie (getBoundingClientRect) powodowało błędy przy szybkim scrollu/skokach w menu.
  const originX = useMotionValue(0.5);
  const originY = useMotionValue(0.5); // ZMIANA: Startujemy od środka (było 0.78)
  const calculatedOrigin = useMotionTemplate`${useTransform(originX, x => x * 100)}% ${useTransform(originY, y => y * 100)}%`;

  // --- RESPANSYWNOŚĆ ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === LOGIKA LATARKI ===
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(40);
  const spotlightColor = useMotionValue('rgba(255, 255, 255, 0.05)');
  const spotlightSize = useSpring(40, { damping: 20, stiffness: 100 });

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, 
    ${spotlightColor} 0%, 
    rgba(0, 0, 0, 0.9) ${spotlightSize}%, 
    rgba(20, 0, 0, 0.4) 100%)`;

  const handleSpotlightHover = (color) => {
    spotlightColor.set(color);
    spotlightSize.set(25);
  };

  const handleSpotlightLeave = () => {
    spotlightColor.set('rgba(255, 255, 255, 0.05)');
    spotlightSize.set(40);
  };

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

  // Logika zmiany motywu (stara - zachowana dla kompatybilności)
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

    // Logika celowania - DYNAMIC TRACKING
    // 1. Śledzimy cel continuously w bezpiecznej strefie (0.55 - 0.649)
    // Dzięki temu origin jest zawsze aktualny w momencie startu zooma (0.65).
    if (latest > 0.55 && latest < 0.649 && zoomTargetRef.current) {
      const rect = zoomTargetRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Delikatny offset
      const OFFSET_X = 0.009;
      const OFFSET_Y = 0.05;

      const newX = (centerX / windowWidth) + OFFSET_X;
      const newY = (centerY / windowHeight) + OFFSET_Y;

      originX.set(newX);
      originY.set(newY);

      zoomTargetRef.current.dataset.measured = "true";
    }
    // 2. Fallback dla strzału z menu (Teleport za 0.65)
    else if (latest >= 0.65 && zoomTargetRef.current && !zoomTargetRef.current.dataset.measured) {
      // Teleport: Używamy "idealnego środka" (z offsetem)
      originX.set(0.509);
      originY.set(0.55);
      zoomTargetRef.current.dataset.measured = "true";
    }
    // 3. Reset
    else if (latest < 0.5 && zoomTargetRef.current?.dataset.measured) {
      delete zoomTargetRef.current.dataset.measured;
    }
  });

  // --- SEKWENCJA RUCHU ---
  const textY = useTransform(contentProgress, [0, 0.07], ["0vh", isMobile ? "-18vh" : "-25vh"]);
  const videoY = useTransform(contentProgress, [0, 0.07], ["100vh", isMobile ? "0vh" : "15vh"]);
  const videoScale = useTransform(contentProgress, [0.08, 0.12], [1, 0.9]);
  const videoX = useTransform(contentProgress, [0.08, 0.12], ["0%", isMobile ? "0%" : "-40%"]);
  const linksOpacity = useTransform(contentProgress, [0.13, 0.18], [0, 1]);
  const linksX = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["0%", "0%"] : ["50vw", "15vw"]);
  const linksY = useTransform(contentProgress, [0.13, 0.18], isMobile ? ["80vh", "30vh"] : ["15vh", "15vh"]);
  const trackX = useTransform(contentProgress, [0.20, 0.24, 0.35, 1.0], ["0%", "0%", "-50%", "-50%"]);

  // --- GRAMOPHONE & ABOUT & SMOKE ---
  const gramophoneZoomProgress = useTransform(contentProgress, [0.65, 0.85], [0, 1]);
  const gramophoneScale = useTransform(gramophoneZoomProgress, [0, 1], [1, 15]);
  // Dynamiczna pozycja startowa dla clipPath (podąża za celownikiem "Snajper")
  const originXPct = useTransform(originX, v => v * 100 - 0.5);
  const originYPct = useTransform(originY, v => v * 100 - 8);
  const clipRadius = useTransform(gramophoneZoomProgress, [0.05, 1], [0, 150]);

  const aboutClipPath = useMotionTemplate`circle(${clipRadius}% at ${originXPct}% ${originYPct}%)`;
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
      data-header-theme="dark"
    >
      <div className="newsong-sticky-viewport">

        {/* Forces GPU layer for the track */}
        <motion.div
          className="newsong-train-track"
          style={{ x: trackX, willChange: 'transform' }}
        >

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
              style={{ y: textY, willChange: 'transform' }}
            >
              <h1 className="newsong-title">GDZIE MOJ DOM</h1>
              <h2 className="newsong-subtitle">OUT NOW • STREAMING EVERYWHERE</h2>
            </motion.div>

            {/* WIDEO */}
            <motion.div
              className="video-container"
              style={{ y: videoY, x: videoX, scale: videoScale, willChange: 'transform' }}
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
                  loading="lazy"
                  width="1280"
                  height="720"
                />

                <div className="play-button">
                  <div className="play-icon"></div>
                </div>
              </div>
            </motion.div>

            {/* LINKI */}
            <motion.div
              className="links-container"
              style={{ opacity: linksOpacity, x: linksX, y: linksY, willChange: 'transform, opacity' }}
            >
              <InteractiveLink
                name="SPOTIFY"
                url="https://open.spotify.com/album/3ex3T8zjsgKoSP9ajrXv2l"
                baseColor="#1DB954"
                onHoverStart={() => handleSpotlightHover('rgba(29, 185, 84, 0.3)')}
                onHoverEnd={handleSpotlightLeave}
              />
              <InteractiveLink
                name="APPLE MUSIC"
                url="https://music.apple.com/us/album/gdzie-m%C3%B3j-dom-single/1845163826"
                baseColor="#FC3C44"
                onHoverStart={() => handleSpotlightHover('rgba(252, 60, 68, 0.3)')}
                onHoverEnd={handleSpotlightLeave}
              />
              <InteractiveLink
                name="YOUTUBE MUSIC"
                url="https://music.youtube.com/playlist?list=OLAK5uy_mvis9FVMPeX96gbKtOFgWsjlooaX5ty_M"
                baseColor="#FF0000"
                onHoverStart={() => handleSpotlightHover('rgba(255, 0, 0, 0.3)')}
                onHoverEnd={handleSpotlightLeave}
              />
              <InteractiveLink
                name="TIDAL"
                url="http://www.tidal.com/album/463841952"
                baseColor="#00FFFF"
                onHoverStart={() => handleSpotlightHover('rgba(0, 255, 255, 0.3)')}
                onHoverEnd={handleSpotlightLeave}
              />
            </motion.div>

          </div>

          {/* PANEL 2: GRAMOPHONE */}
          <Gramophone
            contentProgress={contentProgress}
            isMenuOpen={props.isMenuOpen}
            zoomTargetRef={zoomTargetRef}
            style={{
              scale: gramophoneScale,
              transformOrigin: calculatedOrigin,
              willChange: 'transform' // Critical for the big zoom
            }}
          />
        </motion.div>

        {/* WARSTWY DODATKOWE (About, Smoke) */}
        <motion.div
          className="newsong-about-layer"
          style={{
            opacity: aboutOpacity,
            clipPath: aboutClipPath,
            pointerEvents: aboutPointerEvents,
            willChange: 'clip-path, opacity' // Critical for the circle reveal
          }}
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

// === INTERACTIVE LINK COMPONENT ===
const InteractiveLink = ({ name, url, baseColor, onHoverStart, onHoverEnd }) => {
  const [displayName, setDisplayName] = useState(name);
  const [isAnimating, setIsAnimating] = useState(false);

  const linkRef = useRef(null);
  const rectRef = useRef(null); // Cache dla rect
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, { damping: 15, stiffness: 150 });
  const springY = useSpring(magneticY, { damping: 15, stiffness: 150 });

  const scrambleText = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@';
    const originalName = name;
    const iterations = 15;

    for (let i = 0; i < iterations; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));

      if (i < iterations - 5) {
        setDisplayName(
          originalName.split('').map((char) =>
            char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
          ).join('')
        );
      } else {
        const revealIndex = Math.floor((i - (iterations - 5)) / 5 * originalName.length);
        setDisplayName(
          originalName.split('').map((char, idx) =>
            idx <= revealIndex ? char : (char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
          ).join('')
        );
      }
    }

    setDisplayName(originalName);
    setIsAnimating(false);
  };

  const handleMouseEnter = () => {
    if (linkRef.current) {
      rectRef.current = linkRef.current.getBoundingClientRect();
    }
    scrambleText();
    onHoverStart?.();
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;

    const rect = rectRef.current;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;

    magneticX.set(deltaX);
    magneticY.set(deltaY);
  };

  const handleMouseLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
    setDisplayName(name);
    setIsAnimating(false);
    onHoverEnd?.();
  };

  return (
    <motion.a
      ref={linkRef}
      href={url}
      className="streaming-link"
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: springX, y: springY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="btn-glow"
        style={{
          backgroundColor: baseColor,
          opacity: 0
        }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.3 }}
      />
      <span>{displayName}</span>
      <span className="link-arrow">↗</span>
    </motion.a>
  );
};

export default NewSong;