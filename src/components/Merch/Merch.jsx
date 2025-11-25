import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './Merch.css';
import ScrollFloat from '../ScrollFloat/ScrollFloat';

// Importy zdjęć (pamiętaj o swoich ścieżkach!)
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
  },
  {
    id: 2,
    name: "YFL EMBOSSED HOODIE",
    price: "459,00 ZŁ",
    status: "WYPRZEDANE",
    image: hoodie1Img,
  },
  {
    id: 3,
    name: "STEALTH ERA T-SHIRT",
    price: "179,00 ZŁ",
    status: "WYPRZEDANE",
    image: teeImg,
  }
];

const Merch = () => {
  const targetRef = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.6) {
      setIsAnimationComplete(true);
    } else {
      setIsAnimationComplete(false);
    }
  });

  // --- ZWOLNIONE ANIMACJE (Większy zakres liczb = wolniejszy ruch) ---

  // A. Produkt 1 (Lewy):
  // Wcześniej: [0, 0.25] -> Szybko
  // Teraz: [0, 0.5] -> Dwa razy wolniej
  const x1 = useTransform(scrollYProgress, [0, 0.5], ["-100vw", "0vw"]);
  const r1 = useTransform(scrollYProgress, [0, 0.5], [-45, 0]);
  const o1 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // B. Produkt 2 (Środkowy):
  const y2 = useTransform(scrollYProgress, [0.1, 0.6], ["100vh", "0vh"]); // Startuje ciut później, kończy później
  const s2 = useTransform(scrollYProgress, [0.1, 0.6], [0.5, 1]);
  const o2 = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  // C. Produkt 3 (Prawy):
  const x3 = useTransform(scrollYProgress, [0, 0.5], ["100vw", "0vw"]);
  const r3 = useTransform(scrollYProgress, [0, 0.5], [45, 0]);
  const o3 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);


  return (
    <section ref={targetRef} className="merch-scroll-container">

      <div className="merch-sticky-wrapper">

        {/* --- TUTAJ WSTAWIAMY NOWY ANIMOWANY NAPIS --- */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.05} // Im wyższa liczba, tym większe opóźnienie między literkami
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

        <div
          className="products-grid"
          style={{ pointerEvents: isAnimationComplete ? 'auto' : 'none' }}
        >

          {/* PRODUKT 1 */}
          <motion.div className="product-card" style={{ x: x1, rotate: r1, opacity: o1 }}>
            <ProductContent product={products[0]} />
          </motion.div>

          {/* PRODUKT 2 */}
          <motion.div className="product-card" style={{ y: y2, scale: s2, opacity: o2 }}>
            <ProductContent product={products[1]} />
          </motion.div>

          {/* PRODUKT 3 */}
          <motion.div className="product-card" style={{ x: x3, rotate: r3, opacity: o3 }}>
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
      <img src={product.image} alt={product.name} className="product-img" />
      <button className="shop-btn">ZOBACZ DROP</button>
      {product.status === "WYPRZEDANE" && <div className="status-badge">SOLD OUT</div>}
    </div>
    <div className="product-info">
      <div className="info-left">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-status">{product.status}</span>
      </div>
      <div className="info-right">
        <span className="product-price">{product.price}</span>
      </div>
    </div>
  </>
);

export default Merch;