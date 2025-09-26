
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  }, [handleDragEvents]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  }, [handleDragEvents]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, onImageUpload]);

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 border-4 border-dashed rounded-2xl transition-all duration-300 ${
        isDragging ? 'border-amber-500 bg-slate-800/80 scale-105' : 'border-slate-700 bg-slate-800/50'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragEvents}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center">
        <UploadIcon />
        <h2 className="mt-4 text-2xl font-semibold text-slate-200">Drag & Drop your photo here</h2>
        <p className="mt-2 text-slate-400">or</p>
        <label
          htmlFor="file-upload"
          className="mt-4 inline-block bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors"
        >
          Browse Files
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        <p className="mt-4 text-xs text-slate-500">Supports: PNG, JPG, WEBP</p>
      </div>
    </div>
  );
};
