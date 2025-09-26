import React from 'react';
import { CameraIcon } from './icons/CameraIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="inline-flex items-center gap-3 mb-2">
        <CameraIcon />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
          AFV Restorasi AI
        </h1>
      </div>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Hembuskan kehidupan baru ke dalam kenangan lama Anda. Unggah foto untuk memperbaiki goresan, meningkatkan warna, dan meningkatkan kualitas secara instan.
      </p>
    </header>
  );
};