// Plik: /src/components/Preloader/Preloader.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';
// Nie musimy nawet importować logo, CSS sam je znajdzie

function Preloader() {
  return (
    <motion.div 
      className="preloader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ZMIANA: Zostawiamy tylko jeden div. 
        Ten div SAM W SOBIE stanie się logiem z gradientem.
      */}
      <motion.div 
        className="shimmer-logo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>
    </motion.div>
  );
}

export default Preloader;