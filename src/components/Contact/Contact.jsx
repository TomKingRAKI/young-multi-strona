import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';
import './Contact.css';
import MagneticButton from '../MagneticButton/MagneticButton';

import multiImg from '../../assets/multi-dark.png';

const Contact = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  // Expose containerRef to parent via forwardRef
  useImperativeHandle(ref, () => containerRef.current);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const clipPathSize = useTransform(scrollYProgress, [0, 0.75], ["0%", "150%"]);

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
    <div ref={containerRef} className="contact-wrapper" data-header-theme="dark">

      <div className="contact-sticky-view" onMouseMove={handleMouseMove}>

        <motion.div
          className="ink-transition-layer"
          style={{
            clipPath: useMotionTemplate`circle(${clipPathSize} at 50% 100%)`
          }}
        >

          <section className="contact-section">

            <div className="marquee-container">
              <motion.div
                className="marquee-text"
                animate={{ x: "-50%" }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              >
                YOUNG FAMILY LABEL — WORLDWIDE — 2025 — MULTI —
                YOUNG FAMILY LABEL — WORLDWIDE — 2025 — MULTI —
              </motion.div>
            </div>

            <div className="contact-grid">
              <div className="contact-info">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="section-label">CONTACT / BOOKING</h2>

                  <CopyLink email="BIZNES@YFL.PL" />
                  <CopyLink email="BOOKING@YFL.PL" />

                  <div className="coordinates-box">
                    <p>YFL HQ COORDINATES:</p>
                    <ChangingNumbers />
                  </div>
                </motion.div>

                <div className="socials-row">
                  <SocialButton
                    icon={<FaInstagram />}
                    link="https://www.instagram.com/youngmulti/"
                    label="Instagram Young Multi"
                  />

                  <SocialButton
                    icon={<FaYoutube />}
                    link="https://www.youtube.com/channel/UCiP6-9NHJ36BCxUWL-gNKYg"
                    label="YouTube Young Multi"
                  />

                  <SocialButton
                    icon={<FaSpotify />}
                    link="https://open.spotify.com/artist/5CkZIA3WpaEFxp0wSjMzRI"
                    label="Spotify Young Multi"
                  />
                </div>
              </div>

              <div className="multi-visual-container">
                <motion.h1 className="giant-bg-text" style={{ x: xTitle }}>
                  CEO
                </motion.h1>

                <motion.img
                  src={multiImg}
                  alt="Young Multi"
                  className="multi-blend"
                  style={{ x: xMove, y: yMove }}
                />
              </div>
            </div>

            <footer className="main-footer">
              <span>© 2025 YFL. ALL RIGHTS RESERVED.</span>
              <a href="https://www.youtube.com/@itompoland" target="_blank" rel="noopener noreferrer" className="creator-link">
                STRONĘ WYKONAŁ ITOM ↗
              </a>
            </footer>

          </section>
        </motion.div>
      </div>
    </div>
  );
});

const ChangingNumbers = () => (
  <div className="coords-text">
    52° 13' 47.2" N <br />
    21° 00' 42.5" E
  </div>
);

const CopyLink = ({ email }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email.toLowerCase());
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="contact-link" onClick={handleCopy} style={{ cursor: 'pointer' }}>
      {copied ? (
        <span className="link-text" style={{ color: '#ff0000' }}>SKOPIOWANO!</span>
      ) : (
        <>
          <span className="link-text">{email}</span>
          <span className="link-arrow">↗</span>
        </>
      )}
    </div>
  );
};

const SocialButton = ({ icon, link, label }) => (
  <MagneticButton strength={0.4}>
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="social-btn"
      aria-label={label}
      whileHover={{ scale: 1.2, backgroundColor: "#fff", color: "#000" }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  </MagneticButton>
);

export default Contact;