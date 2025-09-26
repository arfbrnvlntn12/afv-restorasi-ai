import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative animate-slide-up border border-slate-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 id="image-preview-title" className="text-xl font-semibold text-amber-400">Hasil Restorasi</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="p-4 flex-grow overflow-auto flex items-center justify-center">
          <img src={imageUrl} alt="Restored preview" className="max-w-full max-h-full object-contain rounded-md" />
        </div>
        <footer className="p-4 border-t border-slate-700 flex justify-center">
          <a
            href={imageUrl}
            download="restored-photo.png"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
          >
            <DownloadIcon />
            Download Gambar
          </a>
        </footer>
      </div>
    </div>
  );
};
