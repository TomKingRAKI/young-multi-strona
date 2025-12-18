import React, { createContext, useContext, useState } from 'react';

const PerformanceContext = createContext({
    tier: 'high', // 'high' | 'medium' | 'low'
    setFps: () => { }
});

export const PerformanceProvider = ({ children }) => {
    const [tier, setTier] = useState('high');

    const setFps = (fps) => {
        let newTier = 'high';
        if (fps < 30) {
            newTier = 'low';
        } else if (fps < 55) {
            newTier = 'medium';
        } else {
            newTier = 'high';
        }

        // Console Log as requested
        console.log(`%c[Performance] FPS detected: ${fps.toFixed(1)} | Tier set to: ${newTier}`,
            fps < 30 ? 'color: red; font-weight: bold;' :
                fps < 55 ? 'color: orange; font-weight: bold;' :
                    'color: green; font-weight: bold;'
        );

        setTier(newTier);
    };

    return (
        <PerformanceContext.Provider value={{ tier, setFps }}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformance = () => useContext(PerformanceContext);
