import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './Merch.css';
import ScrollFloat from '../ScrollFloat/ScrollFloat';

// Importy zdjęć
import hoodieImg from '../../assets/hoodie1.png';
import hoodie1Img from '../../assets/hoodie2.png';
import teeImg from '../../assets/tshirt.png';

const products = [
  {
    id: 1,
    name: "YFL PATCH HOODIE",
    price: "499,00 ZŁ",
    status: "WYPRZEDANE",
    image: hoodieImg,
    link: "https://sklep.yfl.pl/products/yfl-limited-hoodie"
  },
  {
    id: 2,
    name: "YFL EMBOSSED HOODIE",
    price: "459,00 ZŁ",
    status: "WYPRZEDANE",
    image: hoodie1Img,
    link: "https://sklep.yfl.pl/products/yfl-hoodie"
  },
  {
    id: 3,
    name: "STEALTH ERA T-SHIRT",
    price: "179,00 ZŁ",
    status: "WYPRZEDANE",
    image: teeImg,
    link: "https://sklep.yfl.pl/products/yfl-basic-tshirt-1"
  }
];

const Merch = () => {
  const targetRef = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // ZMIANA: Kończymy logikę przy 0.8, żeby dać czas dla sekcji Contact
    const threshold = isMobile ? 0.8 : 0.6;
    setIsAnimationComplete(latest >= threshold);
  });

  // --- DESKTOP (BEZ ZMIAN) ---
  const desktopX1 = useTransform(scrollYProgress, [0, 0.5], ["-100vw", "0vw"]);
  const desktopR1 = useTransform(scrollYProgress, [0, 0.5], [-45, 0]);
  const desktopO1 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const desktopY2 = useTransform(scrollYProgress, [0.1, 0.6], ["100vh", "0vh"]);
  const desktopS2 = useTransform(scrollYProgress, [0.1, 0.6], [0.5, 1]);
  const desktopO2 = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const desktopX3 = useTransform(scrollYProgress, [0, 0.5], ["100vw", "0vw"]);
  const desktopR3 = useTransform(scrollYProgress, [0, 0.5], [45, 0]);
  const desktopO3 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // --- MOBILE (PRZYSPIESZONE TEMPO) ---

  // Header: Szybki wjazd na górę (0 -> 0.1)
  const mobileHeaderY = useTransform(scrollYProgress, [0, 0.1], ["15vh", "8vh"]);
  const mobileHeaderScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.85]);

  // Produkt 1: Szybki wyjazd (0.1 -> 0.3)
  const mobileX1 = useTransform(scrollYProgress, [0.1, 0.3], ["0vw", "-120vw"]);
  const mobileOpacity1 = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]);

  // Produkt 2: Wjazd, Pauza, Wyjazd (0.3 -> 0.65)
  // Wcześniej kończył się przy 0.8, teraz przy 0.65
  const mobileX2 = useTransform(scrollYProgress, [0.3, 0.45, 0.5, 0.65], ["120vw", "0vw", "0vw", "-120vw"]);
  const mobileOpacity2 = useTransform(scrollYProgress, [0.3, 0.35, 0.6, 0.65], [0, 1, 1, 0]);

  // Produkt 3: Finałowy wjazd (0.65 -> 0.8)
  // Wcześniej kończył się przy 0.95, teraz przy 0.80.
  // Dzięki temu od 0.80 do 1.0 nic się nie rusza, a "Ink Spill" może spokojnie wjechać.
  const mobileX3 = useTransform(scrollYProgress, [0.65, 0.8], ["120vw", "0vw"]);

  return (
    <section ref={targetRef} className="merch-scroll-container">

      <div className="merch-sticky-wrapper">

        <motion.div
          key={isMobile ? "mobile-header" : "desktop-header"}
          className="merch-header-wrapper"
          style={isMobile ? { y: mobileHeaderY, scale: mobileHeaderScale } : {}}
        >
          <div className="merch-header-inner">
            <ScrollFloat
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='top bottom'
              scrollEnd='bottom center'
              stagger={0.05}
            >
              SELECTED GOODS
            </ScrollFloat>

            <motion.p
              className="merch-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              YOUNG FAMILY LABEL • SEASON 2025
            </motion.p>
          </div>
        </motion.div>

        <div
          className="products-grid"
          style={{ pointerEvents: isAnimationComplete ? 'auto' : 'none' }}
        >

          {/* PRODUKT 1 */}
          <motion.div
            className="product-card"
            style={{
              x: isMobile ? mobileX1 : desktopX1,
              rotate: isMobile ? 0 : desktopR1,
              opacity: isMobile ? mobileOpacity1 : desktopO1,
              scale: 1,
              y: 0
            }}
          >
            <ProductContent product={products[0]} />
          </motion.div>

          {/* PRODUKT 2 */}
          <motion.div
            className="product-card"
            style={{
              x: isMobile ? mobileX2 : 0,
              y: isMobile ? 0 : desktopY2,
              scale: isMobile ? 1 : desktopS2,
              opacity: isMobile ? mobileOpacity2 : desktopO2
            }}
          >
            <ProductContent product={products[1]} />
          </motion.div>

          {/* PRODUKT 3 */}
          <motion.div
            className="product-card"
            style={{
              x: isMobile ? mobileX3 : desktopX3,
              rotate: isMobile ? 0 : desktopR3,
              opacity: isMobile ? 1 : desktopO3
            }}
          >
            <ProductContent product={products[2]} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const ProductContent = ({ product }) => (
  <>
    <div className="product-image-wrapper">
      {/* 1. Link owijający zdjęcie - kliknięcie w zdjęcie przenosi do sklepu */}
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="img-link"
      >
        <img src={product.image} alt={product.name} className="product-img" />
      </a>

      {/* 2. Link jako przycisk - zmieniliśmy <button> na <a>, ale klasa została ta sama */}
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn"
      >
        ZOBACZ DROP
      </a>

      {product.status === "WYPRZEDANE" && <div className="status-badge">SOLD OUT</div>}
    </div>

    <div className="product-info">
      <div className="info-left">
        {/* Opcjonalnie: Nazwa produktu też może być linkiem */}
        <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name">{product.name}</h3>
        </a>
        <span className="product-status">{product.status}</span>
      </div>
      <div className="info-right">
        <span className="product-price">{product.price}</span>
      </div>
    </div>
  </>
);

export default Merch;