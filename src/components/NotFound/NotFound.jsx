import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {

    return (
        <motion.div
            className="not-found-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="glitch-404" data-text="404">404</div>
            <h2 className="error-message">SYSTEM FAILURE / PAGE LOST</h2>
            <button
                className="return-home-btn"
                onClick={() => window.location.href = '/'}
            >
                RETURN TO SIGNAL
            </button>
        </motion.div>
    );
};

export default NotFound;
