// Plik: /src/components/Hero/Hero.jsx

// ZMIANA: Importujemy 'useTransform'
import React, { useState } from 'react'; 
import { motion, useTransform } from 'framer-motion';
import './Hero.css';

import cutoutPerson from '../../assets/cutout-person.png'; 
// Logo już tu niepotrzebne

// ZMIANA: Przyjmujemy 'scrollY' jako prop
function Hero({ scrollY }) {
  
  const [isYoungHovered, setIsYoungHovered] = useState(false);

  // ZMIANA: Tworzymy transformację paralaksy
  // Gdy 'scrollY' (z App.jsx) idzie od 0 do 500,
  // 'y' (pozycja naszego contentu) pójdzie od 0 do 250 (pół wolniej)
  const y = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    // Ta sekcja jest lepka i zostaje w tle
    <motion.section 
      className="hero-section"
    >
      {/* ZMIANA: Dodajemy wrapper, który będzie się poruszał
          z efektem paralaksy (wolniej niż scroll) */}
      <motion.div className="hero-content-wrapper" style={{ y }}>
        
        {/* CAŁA reszta kodu z animacjami zostaje
            przeniesiona DO ŚRODKA wrappera */}

        <motion.img 
          src="/multiztlem.png" 
          alt="Tło" 
          className="hero-background-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        <motion.img 
          src={cutoutPerson} 
          alt="Artysta" 
          className="hero-cutout-image"
          // ... (cała reszta animacji hover 3D)
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            rotateY: isYoungHovered ? 10 : 0,
            rotateX: isYoungHovered ? 3 : 0,
            scale: isYoungHovered ? 1.03 : 1,
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.5 }, 
            default: { type: 'spring', stiffness: 300, damping: 20 }
          }}
        />

        {/* ZMIANA: Usuwamy <nav> (przeniesione do Header.jsx) */}

        <motion.h1 
          className="text-young"
          // ... (cała reszta animacji wejścia i hover)
          initial={{ y: "-44%", opacity: 0 }}
          animate={{ 
            y: "-34%", 
            opacity: 1,
            x: isYoungHovered ? 50 : 0,
          }}
          onHoverStart={() => setIsYoungHovered(true)}
          onHoverEnd={() => setIsYoungHovered(false)}
          transition={{
            y: { duration: 0.8, delay: 1.0 },
            opacity: { duration: 0.8, delay: 1.0 },
            x: { type: 'spring', stiffness: 400, damping: 25 }
          }}
        >
          YOUNG
        </motion.h1>
        
        <motion.h2 
          className="text-multi"
          // ... (cała reszta animacji wejścia i hover)
          initial={{ y: "70%", opacity: 0 }}
          animate={{ 
            y: "80%", 
            opacity: 1,
            x: isYoungHovered ? -50 : 0,
          }}
          transition={{
            y: { duration: 0.8, delay: 1.2 },
            opacity: { duration: 0.8, delay: 1.2 },
            x: { type: 'spring', stiffness: 400, damping: 25 }
          }}
        >
          MULTI
        </motion.h2>

      </motion.div> {/* Koniec wrappera paralaksy */}
    </motion.section>
  );
}

export default Hero;