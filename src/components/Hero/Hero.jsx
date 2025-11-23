// Plik: /src/components/Hero/Hero.jsx

import React, { useState, useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import './Hero.css';

// Zostawiamy tylko jeden, główny obrazek
import cutoutPerson from '../../assets/cutout-person.png';

function Hero({ scrollY }) {
  // 1. Śledzenie pozycji myszki (X) dla napisów
  const mouseX = useMotionValue(0);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Obliczanie ruchu dla napisów (Lewo/Prawo)
  // YOUNG idzie przeciwnie do myszki (lub zgodnie, zależnie jak wolisz)
  const xYoung = useTransform(mouseX, [0, windowWidth], [50, -50]);
  const xMulti = useTransform(mouseX, [0, windowWidth], [-50, 50]);

  // Paralaksa pionowa (od scrolla)
  const y = useTransform(scrollY, [0, 1000], [0, -150]);

  // Funkcja aktualizująca pozycję myszki
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
  };

  return (
    <motion.section
      className="hero-section"
      // Nasłuchujemy ruchu myszki na całej sekcji dla efektu tekstowego
      onMouseMove={handleMouseMove}
    >
      <motion.div className="hero-content-wrapper" style={{ y }}>

        <motion.img
          src="/multiztlem.png"
          alt="Tło"
          className="hero-background-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* KONTENER Z POSTACIĄ (Teraz tylko jeden statyczny obrazek) */}
        <div className="hero-person-container">
          <motion.img
            src={cutoutPerson}
            alt="Artysta"
            className="hero-cutout-image"
            // Tylko wejście przy ładowaniu strony
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* --- NAPISY REAGUJĄCE NA MYSZKĘ --- */}
        <motion.h1
          className="text-young"
          style={{ x: xYoung }} // Ruch myszką
          initial={{ y: "-44%", opacity: 0 }}
          animate={{ y: "-34%", opacity: 1 }}
          transition={{
            y: { duration: 0.8, delay: 1.0 },
            opacity: { duration: 0.8, delay: 1.0 }
          }}
        >
          YOUNG
        </motion.h1>

        <motion.h2
          className="text-multi"
          style={{ x: xMulti }} // Ruch myszką
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "80%", opacity: 1 }}
          transition={{
            y: { duration: 0.8, delay: 1.2 },
            opacity: { duration: 0.8, delay: 1.2 }
          }}
        >
          MULTI
        </motion.h2>

      </motion.div>
    </motion.section >
  );
}

export default Hero;