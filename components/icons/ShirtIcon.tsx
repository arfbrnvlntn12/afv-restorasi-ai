
import React from 'react';

interface IconProps {
    iconClass: string;
}

export const ShirtIcon: React.FC<IconProps> = ({ iconClass }) => (
    <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m3-10.5a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-1.5a1.5 1.5 0 0 0-1.5 1.5v2.25a3 3 0 0 1-3 3h-1.5a1.5 1.5 0 0 1-1.5-1.5v-2.25a3 3 0 0 0-3-3H6a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h7.5Z" />
    </svg>
);
