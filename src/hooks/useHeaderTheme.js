import { useState, useEffect, useRef } from 'react';

function useHeaderTheme() {
    const [theme, setTheme] = useState('light');
    const lastThemeRef = useRef('light');

    useEffect(() => {
        const updateTheme = () => {
            const sections = document.querySelectorAll('[data-header-theme]');
            if (sections.length === 0) return;

            // Find the section that is currently "behind" the header
            // We look for sections where:
            // 1. Their bottom is still visible (bottom > 0)
            // 2. Their top has scrolled past header OR is at header (top <= 100)
            // Priority: the section with the SMALLEST (most negative) top that still has bottom > 0

            let activeSection = null;
            let bestTop = Infinity; // We want most negative (smallest) top

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();

                // Skip sections that are completely below viewport header area
                if (rect.top > 100) return;

                // Skip sections that have scrolled completely past (bottom <= 0)
                if (rect.bottom <= 0) return;

                // This section overlaps the header area
                // Pick the one with smallest top (most scrolled into view)
                // But ignore sections with top === 0 if there are others with negative top
                // (this handles fixed/sticky sections)

                if (rect.top < bestTop) {
                    bestTop = rect.top;
                    activeSection = section;
                }
            });

            if (activeSection) {
                const newTheme = activeSection.dataset.headerTheme;
                if (newTheme && newTheme !== lastThemeRef.current) {
                    console.log('[useHeaderTheme] THEME CHANGE:', lastThemeRef.current, '->', newTheme,
                        '| Section top:', Math.round(bestTop));
                    lastThemeRef.current = newTheme;
                    setTheme(newTheme);
                }
            }
        };

        // Initial check
        setTimeout(updateTheme, 500);

        const handleScroll = () => {
            requestAnimationFrame(updateTheme);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return { theme };
}

export default useHeaderTheme;
