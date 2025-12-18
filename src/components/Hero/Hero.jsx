// Plik: /src/components/Hero/Hero.jsx

import React, { useState, useEffect, forwardRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import './Hero.css';

import cutoutPerson from '../../assets/cutout-person.png';

const Hero = forwardRef(function Hero({ scrollY, startAnimation = false }, ref) {
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
      ref={ref}
      className="hero-section"
      data-header-theme="light"
      onMouseMove={handleMouseMove}
    >
      <motion.div className="hero-content-wrapper" style={{ y }}>

        <motion.img
          src="/multiztlem.png"
          alt="Tło"
          className="hero-background-image"
          initial={{ opacity: 0, scale: 1.15 }} // Started zoomed in
          animate={startAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.15 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} // Match transition curve
        />

        <div className="hero-person-container">
          <motion.img
            src={cutoutPerson}
            alt="Artysta"
            className="hero-cutout-image"
            initial={{ opacity: 0, scale: 1.1, y: 50 }}
            animate={startAnimation ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 1.1, y: 50 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          />
        </div>

        <motion.h1
          className="text-young"
          style={{ x: isMobile ? 0 : xYoung }}
          initial={{ y: "-20%", opacity: 0, filter: "blur(10px)" }}
          animate={startAnimation ? { y: "-34%", opacity: 1, filter: "blur(0px)" } : { y: "-20%", opacity: 0, filter: "blur(10px)" }}
          transition={{
            y: { duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.0, delay: 0.4 },
            filter: { duration: 1.0, delay: 0.4 }
          }}
        >
          YOUNG
        </motion.h1>

        <motion.h2
          className="text-multi"
          style={{ x: isMobile ? 0 : xMulti }}
          initial={{ y: "90%", opacity: 0, filter: "blur(10px)" }}
          animate={startAnimation ? { y: "80%", opacity: 1, filter: "blur(0px)" } : { y: "90%", opacity: 0, filter: "blur(10px)" }}
          transition={{
            y: { duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.0, delay: 0.6 },
            filter: { duration: 1.0, delay: 0.6 }
          }}
        >
          MULTI
        </motion.h2>

      </motion.div>
    </motion.section>
  );
});

export default Hero;
