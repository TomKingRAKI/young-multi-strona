// Plik: /src/components/Hero/Hero.jsx

import React, { useState, useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import './Hero.css';

import cutoutPerson from '../../assets/cutout-person.png';

function Hero({ scrollY, startAnimation = false }) {
  const mouseX = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const xYoung = useTransform(smoothMouseX, [0, windowWidth], [50, -50]);
  const xMulti = useTransform(smoothMouseX, [0, windowWidth], [-50, 50]);

  const y = useTransform(scrollY, [0, 1000], [0, -150]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
  };

  return (
    <motion.section
      className="hero-section"
      data-header-theme="light"
      onMouseMove={handleMouseMove}
    >
      <motion.div className="hero-content-wrapper" style={{ y }}>

        <motion.img
          src="/multiztlem.png"
          alt="Tło"
          className="hero-background-image"
          initial={{ opacity: 0 }}
          animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        <div className="hero-person-container">
          <motion.img
            src={cutoutPerson}
            alt="Artysta"
            className="hero-cutout-image"
            initial={{ opacity: 0 }}
            animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        <motion.h1
          className="text-young"
          style={{ x: isMobile ? 0 : xYoung }}
          initial={{ y: "-44%", opacity: 0 }}
          animate={startAnimation ? { y: "-34%", opacity: 1 } : { y: "-44%", opacity: 0 }}
          transition={{
            y: { duration: 0.8, delay: 1.0 },
            opacity: { duration: 0.8, delay: 1.0 }
          }}
        >
          YOUNG
        </motion.h1>

        <motion.h2
          className="text-multi"
          style={{ x: isMobile ? 0 : xMulti }}
          initial={{ y: "70%", opacity: 0 }}
          animate={startAnimation ? { y: "80%", opacity: 1 } : { y: "70%", opacity: 0 }}
          transition={{
            y: { duration: 0.8, delay: 1.2 },
            opacity: { duration: 0.8, delay: 1.2 }
          }}
        >
          MULTI
        </motion.h2>

      </motion.div>
    </motion.section>
  );
}

export default Hero;