import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import './Contact.css';

// Pamiętaj o swoim zdjęciu!
import multiImg from '../../assets/multi-dark.png';

const Contact = () => {
  const containerRef = useRef(null);

  // Śledzimy scroll wewnątrz wysokiego kontenera (300vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // --- 1. PRZEJŚCIE (INK SPILL) ---
  // POPRAWKA: Zmieniliśmy zakres z [0, 0.3] na [0, 0.75]
  // Dzięki temu koło powiększa się DUŻO WOLNIEJ podczas scrollowania.
  const clipPathSize = useTransform(scrollYProgress, [0, 0.75], ["0%", "150%"]);

  // --- 2. PARALAKSA DLA MULTIEGO ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX / width) - 0.5);
    mouseY.set((clientY / height) - 0.5);
  };

  const springConfig = { damping: 25, stiffness: 150 };
  const xMove = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]), springConfig);
  const yMove = useSpring(useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]), springConfig);
  const xTitle = useSpring(useTransform(mouseX, [-0.5, 0.5], ["5%", "-5%"]), springConfig);

  return (
    // Kontener scrolla (długi)
    <div ref={containerRef} className="contact-wrapper">

      {/* Sticky View - To sprawia, że zawartość stoi w miejscu podczas animacji */}
      <div className="contact-sticky-view" onMouseMove={handleMouseMove}>

        {/* --- WARSTWA PRZEJŚCIA (Zalewa ekran czernią) --- */}
        <motion.div
          className="ink-transition-layer"
          style={{
            // Maska koła
            clipPath: useMotionTemplate`circle(${clipPathSize} at 50% 100%)`
          }}
        >

          {/* --- ZAWARTOŚĆ (WIDOCZNA DOPIERO W CZERNI) --- */}
          <section className="contact-section">

            <div className="marquee-container">
              <motion.div
                className="marquee-text"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                YOUNG FAMILY LABEL — WORLDWIDE — 2025 — MULTI —
                YOUNG FAMILY LABEL — WORLDWIDE — 2025 — MULTI —
              </motion.div>
            </div>

            <div className="contact-grid">
              {/* LEWA STRONA */}
              <div className="contact-info">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="section-label">CONTACT / BOOKING</h2>

                  <a href="mailto:biznes@yfl.pl" className="contact-link">
                    <span className="link-text">BIZNES@YFL.PL</span>
                    <span className="link-arrow">↗</span>
                  </a>
                  <a href="mailto:booking@yfl.pl" className="contact-link">
                    <span className="link-text">BOOKING@YFL.PL</span>
                    <span className="link-arrow">↗</span>
                  </a>

                  <div className="coordinates-box">
                    <p>YFL HQ COORDINATES:</p>
                    <ChangingNumbers />
                  </div>
                </motion.div>

                <div className="socials-row">
                  <SocialButton name="IG" />
                  <SocialButton name="YT" />
                  <SocialButton name="SP" />
                </div>
              </div>

              {/* PRAWA STRONA */}
              <div className="multi-visual-container">
                <motion.h1 className="giant-bg-text" style={{ x: xTitle }}>
                  CEO
                </motion.h1>

                <motion.img
                  src={multiImg}
                  alt="Young Multi"
                  className="multi-blend"  // <--- ZMIANA Z 'multi-img' NA 'multi-blend' !!!
                  style={{ x: xMove, y: yMove }}
                />
              </div>
            </div>

            <footer className="main-footer">
              <span>© 2025 YFL. ALL RIGHTS RESERVED.</span>
              <span>DESIGNED BY AI & YOU.</span>
            </footer>

          </section>
        </motion.div>
      </div>
    </div>
  );
};

const ChangingNumbers = () => (
  <div className="coords-text">
    52° 13' 47.2" N <br />
    21° 00' 42.5" E
  </div>
);

const SocialButton = ({ name }) => (
  <motion.a
    href="#"
    className="social-btn"
    whileHover={{ scale: 1.2, backgroundColor: "#fff", color: "#000" }}
    whileTap={{ scale: 0.9 }}
  >
    {name}
  </motion.a>
);

export default Contact;