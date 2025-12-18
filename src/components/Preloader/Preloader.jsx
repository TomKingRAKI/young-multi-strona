import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';
import logoWhite from '../../assets/logoyflbiale.png'; // Import logo

// System checks logic (simplified for cleaner component)
const useSystemChecks = () => {
  const [issues, setIssues] = useState([]);
  const fpsRef = useRef({ frames: [], startTime: 0 });

  useEffect(() => {
    const checkGPU = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
        return !!gl;
      } catch { return false; }
    };

    const hasGPU = checkGPU();
    if (!hasGPU) setIssues(prev => [...prev, { type: 'gpu', title: 'No GPU Detected' }]);

    // FPS Check not blocking the main flow anymore, just logging
  }, []);

  return issues;
};

// MINIMALIST LUXURY VARIANT
const containerVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const blindVariants = {
  initial: { scaleY: 1 },
  exit: {
    scaleY: 0,
    transition: {
      duration: 0.9,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

// Logo moves up WITH the middle blind (index 2 = 0.2s delay)
const logoExitVariant = {
  initial: { y: 0, opacity: 1 },
  animate: { y: 0, opacity: 1 },
  exit: {
    y: "-120vh", // Move completely off screen upwards
    opacity: 1, // DO NOT FADE OUT
    transition: {
      duration: 0.9,
      delay: 0.1 + 0.2, // container delay (0.2) + blind index 2 delay (0.2) -> actually container delay applies to children start? 
      // Wait, staggerChildren applies to direct children. 
      // The Blinds are direct children. The Content is a direct child?
      // Let's manually sync.
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

function Preloader({ onComplete }) {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const issues = useSystemChecks();

  useEffect(() => {
    const runSequence = async () => {
      // 1. Initial State
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Start Progress Tween (0 -> 100% over ~4.5 seconds)
      const duration = 4500;
      const start = Date.now();

      const progressInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const p = Math.min((elapsed / duration) * 100, 100);
        setProgress(p);

        if (p >= 100) clearInterval(progressInterval);
      }, 50);

      // 2. Wait for fonts & minimal initial load (1s)
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. WARM-UP SCROLL (Unlock scrollbar so user sees movement)
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto'; // Ensure scrollbar is visible

      // Scroll Down (~2s)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Scroll Up (~1.5s)
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 4. Final Sync
      clearInterval(progressInterval);
      setProgress(100);

      // Ensure we are strictly at top before revealing
      window.scrollTo(0, 0);

      // Proceed to Exit
      setIsReady(true);
      if (onComplete) onComplete();
    };

    runSequence();

    // Cleanup - Ensure scroll is restored
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div
      className="preloader-container"
      variants={containerVariants}
      initial="initial"
      exit="exit"
    >
      {/* 5 Vertical Blinds */}
      <div className="blinds-layer">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="blind-col"
            variants={blindVariants}
          />
        ))}
      </div>

      {/* Content - Logo & Percentage */}
      <motion.div
        className="preloader-content"
        variants={logoExitVariant}
        /* Using specific variant to sync with blinds */
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="minimal-logo-wrapper">
          {/* Base Dim Logo */}
          <img src={logoWhite} className="logo-base" alt="logo" />

          {/* Filled Logo (Opacity Clip based on progress) */}
          <div className="logo-fill-container" style={{ height: `${progress}%` }}>
            <img src={logoWhite} className="logo-filled" alt="logo" />
          </div>
        </div>

        <div className="minimal-counter">
          {Math.round(progress)}%
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Preloader;