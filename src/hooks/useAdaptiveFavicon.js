import { useEffect } from 'react';

const useAdaptiveFavicon = () => {
    useEffect(() => {
        // Select the existing favicon link
        const link = document.querySelector("link[rel~='icon']");
        if (!link) return;

        // Define the sources
        const faviconWhite = '/favicon-white.png'; // For Dark Mode (White Logo)
        const faviconBlack = '/favicon-black.png'; // For Light Mode (Black Logo)

        // Function to update favicon based on theme
        const updateFavicon = (e) => {
            const isDarkMode = e.matches;
            link.href = isDarkMode ? faviconWhite : faviconBlack;
        };

        // Initial check
        const matcher = window.matchMedia('(prefers-color-scheme: dark)');
        updateFavicon(matcher); // Set initial state

        // Listen for changes
        if (matcher.addEventListener) {
            matcher.addEventListener('change', updateFavicon);
        } else {
            // Fallback for older browsers
            matcher.addListener(updateFavicon);
        }

        // Cleanup
        return () => {
            if (matcher.removeEventListener) {
                matcher.removeEventListener('change', updateFavicon);
            } else {
                matcher.removeListener(updateFavicon);
            }
        };
    }, []);
};

export default useAdaptiveFavicon;
