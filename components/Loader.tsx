
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-500"></div>
        <p className="text-amber-400 font-semibold text-lg">Restoring your photo...</p>
        <p className="text-slate-400 text-sm max-w-xs text-center">This can take a moment. The AI is hard at work enhancing your memory.</p>
    </div>
  );
};
