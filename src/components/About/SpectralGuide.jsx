import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './About.css'; // Zakładamy style w About.css

export function SpectralGuide({ startPos, ghostOffset }) {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            // 1. Materializacja (Fade in)
            await controls.start({
                opacity: 0.6,
                scale: 1,
                x: 0, // Względem startPos
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" }
            });

            // 2. Chwyt (Lekkie skurczenie)
            await controls.start({
                scale: 0.8,
                transition: { duration: 0.3 }
            });

            // 3. Pociągnięcie (Ruch w bok - np. w lewo)
            // Równocześnie animujemy ghostOffset, żeby dred się ruszał
            const pullDistance = -80;

            // Uruchamiamy animację ducha
            const ghostMove = controls.start({
                x: pullDistance,
                transition: { duration: 1, type: "spring", stiffness: 50 }
            });

            // RĘCZNIE animujemy MotionValue (ghostOffset)
            // Framer Motion 'animate' function is cleaner here but we are inside useEffect
            // We can use the animate function from framer-motion import if needed, 
            // but here we can just rely on the fact that we need to sync them.
            // Let's use a simple approach: animate the ghostOffset manually.

            // Ale uwaga: ghostOffset to MotionValue. Możemy go animować.
            // Zróbmy to równolegle.

            // Symulacja pociągnięcia dreda
            // Musimy zaimportować 'animate' z framer-motion na górze pliku, ale tu użyjemy prostego triku:
            // Skoro duch jest pozycjonowany absolutnie w kontenerze, a dred reaguje na offset...
            // To ghostOffset musi dostać wartość `pullDistance`.

            // Używamy animate z framer-motion (musimy dodać import)
            // Zakładam, że animate jest dostępne w imporcie (dodam w pliku).

            // Pociągnij dreda
            const dreadPull = ghostOffset.x.set(pullDistance); // To jest skokowe, chcemy animację.
            // Wróć. Użyjmy animate() z framer-motion.
        };

        // Zamiast async/await w ten sposób, zróbmy pełną sekwencję z animate()
        // Bo musimy synchronizować MotionValue (dred) z animacją komponentu (duch).

        const runLoop = async () => {
            // Reset
            ghostOffset.x.set(0);
            ghostOffset.y.set(0);

            // 1. Appear
            await controls.start({ opacity: 0.6, scale: 1, transition: { duration: 0.8 } });

            // 2. Grab
            await controls.start({ scale: 0.8, transition: { duration: 0.3 } });

            // 3. Pull (Ghost moves, Dread follows)
            // We need to animate ghostOffset.x alongside controls
            // We can use a helper promise for the dread animation
            // 3. Pull (Visual Ghost moves fluidly)
            const ghostPull = controls.start({ x: "-4.16vw", transition: { duration: 1.0, ease: "easeInOut" } });

            // Dread Physics (Virtual units: 1000px space)
            // Musimy pociągnąć dreda o -80 jednostek w jego wewnętrznym układzie
            const dreadPull = import('framer-motion').then(({ animate }) => {
                return animate(ghostOffset.x, -80, { duration: 1.0, ease: "easeInOut" });
            });

            await Promise.all([ghostPull, dreadPull]);

            // 4. Release (Ghost fades out, Dread springs back)
            const fadeOut = controls.start({ opacity: 0, scale: 1.5, transition: { duration: 0.4 } });

            // Dread springs back
            const dreadRelease = import('framer-motion').then(({ animate }) => {
                return animate(ghostOffset.x, 0, { type: "spring", stiffness: 400, damping: 20 });
            });

            await Promise.all([fadeOut, dreadRelease]);

            // Reset ghost position for next loop (invisible)
            controls.set({ x: 0, y: 0 });

            // 5. Pause
            await new Promise(r => setTimeout(r, 2000));

            // Loop
            if (true) runLoop(); // Infinite loop while mounted
        };

        runLoop();

        return () => {
            controls.stop();
            // Reset dread on unmount
            ghostOffset.x.set(0);
            ghostOffset.y.set(0);
        };
    }, [controls, ghostOffset]);

    return (
        <motion.div
            className="spectral-guide"
            initial={{ opacity: 0, scale: 0 }}
            animate={controls}
            style={{
                left: startPos.x,
                top: startPos.y,
            }}
        >
            <div className="spectral-core" />
            <div className="spectral-glow" />
        </motion.div>
    );
}
