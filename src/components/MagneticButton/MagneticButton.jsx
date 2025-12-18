// Plik: /src/components/MagneticButton/MagneticButton.jsx

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './MagneticButton.css';

function MagneticButton({ children, className = '', strength = 0.3, ...props }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`magnetic-button ${className}`}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default MagneticButton;
