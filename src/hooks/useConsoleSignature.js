import { useEffect } from 'react';

const useConsoleSignature = () => {
    useEffect(() => {
        const signature = `
%c  __  _______  __  __
%c |  \\/  |_   _|  \\/  |
%c | |\\/| | | | | |\\/| |   %c DESIGNED & DEVELOPED
%c | |  | | | | | |  | |   %c BY TOMASZ SZMAJDA
%c |_|  |_| |_| |_|  |_|   %c (STUDENT UO)
    `;

        const style1 = 'color: #fff; font-weight: bold; font-family: monospace;';
        const style2 = 'color: #aaa; font-family: sans-serif; font-size: 10px;';

        console.log(
            signature,
            style1,
            style1,
            style1, style2,
            style1, style2,
            style1, style2
        );

        console.log(
            '%c Looking for the source code? Contact me: itom.contact@gmail.com',
            'background: #111; color: #fff; padding: 5px 10px; border-radius: 3px;'
        );
    }, []);
};

export default useConsoleSignature;
