import React from 'react';
import { motion } from 'framer-motion';
import './Merch.css';
import hoodieImg from '../../assets/hoodie1.png';
import hoodie1Img from '../../assets/hoodie2.png';
import teeImg from '../../assets/tshirt.png';

// Tutaj wpisz dane swoich produktów
const products = [
  {
    id: 1,
    name: "YFL PATCH HOODIE",
    price: "499,00 ZŁ",
    status: "WYPRZEDANE",
    // Zmień ten link na import swojego zdjęcia, np. import hoodie1 from '../../assets/hoodie1.png'
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
  return (
    <section className="merch-section">

      {/* Nagłówek sekcji */}
      <motion.div
        className="merch-header"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="merch-title">SELECTED GOODS</h1>
        <p className="merch-subtitle">YOUNG FAMILY LABEL • SEASON 2025</p>
      </motion.div>

      {/* Grid z produktami */}
      <div className="products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="product-card"
            // Animacja wjazdu kafelków (jeden po drugim)
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.2, // Opóźnienie tworzy efekt "fali"
              ease: "backOut"
            }}
          >
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
              />

              {/* Przycisk pojawia się po najechaniu */}
              <button className="shop-btn">
                ZOBACZ DROP
              </button>

              {/* Opcjonalnie: Naklejka statusu na obrazku */}
              {product.status === "WYPRZEDANE" && (
                <div className="status-badge">SOLD OUT</div>
              )}
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
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default Merch;