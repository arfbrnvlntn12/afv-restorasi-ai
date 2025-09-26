
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface ResultsDisplayProps {
  restoredImage: string;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ restoredImage, onReset }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <a
        href={restoredImage}
        download="restored-photo.png"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
      >
        <DownloadIcon />
        Download
      </a>
      <button
        onClick={onReset}
        className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
      >
        <ArrowPathIcon />
        Restore Another
      </button>
    </div>
  );
};
