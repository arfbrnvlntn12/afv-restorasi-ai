import React from 'react';
import { BaseRestorationType, AdditiveOptions, CameraQuality, CameraAngle, AspectRatio } from '../services/geminiService';
import { ShirtIcon } from './icons/ShirtIcon';

interface BaseOption {
  id: BaseRestorationType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AdditiveOption {
    id: keyof AdditiveOptions;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface RestorationOptionsProps {
  baseOption: BaseRestorationType;
  onBaseOptionChange: (option: BaseRestorationType) => void;
  additiveOptions: AdditiveOptions;
  onAdditiveOptionsChange: (options: AdditiveOptions) => void;
  clothingPrompt: string;
  onClothingPromptChange: (prompt: string) => void;
  backgroundPrompt: string;
  onBackgroundPromptChange: (prompt: string) => void;
  posePrompt: string;
  onPosePromptChange: (prompt: string) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  cameraQuality: CameraQuality;
  onCameraQualityChange: (quality: CameraQuality) => void;
  cameraAngle: CameraAngle;
  onCameraAngleChange: (angle: CameraAngle) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export const RestorationOptions: React.FC<RestorationOptionsProps> = ({ 
    baseOption, 
    onBaseOptionChange, 
    additiveOptions,
    onAdditiveOptionsChange,
    clothingPrompt, 
    onClothingPromptChange,
    backgroundPrompt,
    onBackgroundPromptChange,
    posePrompt,
    onPosePromptChange,
    customPrompt,
    onCustomPromptChange,
    cameraQuality,
    onCameraQualityChange,
    cameraAngle,
    onCameraAngleChange,
    aspectRatio,
    onAspectRatioChange,
}) => {
    const iconClass = "w-8 h-8 mb-2 text-amber-400";
    const buttonClass = (isSelected: boolean) => 
        `p-4 rounded-lg border-2 text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            isSelected
            ? 'bg-slate-700/80 border-amber-500 ring-2 ring-amber-500 shadow-lg'
            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
        }`;

    const handleAdditiveChange = (optionId: keyof AdditiveOptions) => {
        onAdditiveOptionsChange({
            ...additiveOptions,
            [optionId]: !additiveOptions[optionId],
        });
    };

    const baseOptions: BaseOption[] = [
      {
        id: 'enhance',
        title: 'Tingkatkan & Perbaiki',
        description: 'Untuk foto berwarna. Memperbaiki kerusakan, mempertajam detail, dan menyempurnakan warna.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
        ),
      },
      {
        id: 'colorize',
        title: 'Warnai Foto H/P',
        description: 'Untuk foto hitam putih. Tambahkan warna yang realistis sambil memperbaiki kerusakan.',
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3-7.284 8.252 8.252 0 0 1 3.362 2.897Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9h.008v.008H16.5V9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9h.008v.008H7.5V9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25h.008v.008H9v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 14.25h.008v.008H15v-.008Z" />
            </svg>
        ),
      },
      {
        id: 'repair_bw',
        title: 'Perbaiki Saja (H/P)',
        description: 'Untuk foto hitam putih. Memperbaiki goresan dan noda tanpa menambahkan warna.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25l-1.5-1.5-6 6-1.5-1.5-1.5 1.5 1.5 1.5-6 6 1.5 1.5 1.5-1.5 6-6 1.5 1.5 1.5-1.5-1.5-1.5 6-6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l6-6" />
            </svg>
        ),
      },
    ];
    
    const additiveOptionsList: AdditiveOption[] = [
       {
        id: 'passport',
        title: 'Buat Foto Paspor',
        description: 'Ubah menjadi foto paspor dengan latar belakang putih.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        ),
      },
      {
        id: 'full_body',
        title: 'Buat Seluruh Badan',
        description: 'AI akan menghasilkan sisa tubuh dari foto sebagian.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
            </svg>
        ),
      },
      {
        id: 'change_clothes',
        title: 'Ganti Pakaian',
        description: 'Ganti pakaian dengan mengetikkan deskripsi.',
        icon: <ShirtIcon iconClass={iconClass} />,
      },
    ];

    const cameraQualityOptions: { id: CameraQuality, label: string }[] = [
      { id: 'default', label: 'Default' },
      { id: '4k', label: 'Kualitas 4K' },
      { id: '8k', label: 'Kualitas 8K' },
    ];

    const cameraAngleOptions: { id: CameraAngle, label: string }[] = [
      { id: 'default', label: 'Default' },
      { id: 'above', label: 'Dari Atas' },
      { id: 'eye_level', label: 'Tengah' },
      { id: 'below', label: 'Dari Bawah' },
    ];

    const aspectRatioOptions: { id: AspectRatio, label: string }[] = [
        { id: 'default', label: 'Default' },
        { id: '1:1', label: '1:1' },
        { id: '3:4', label: '3:4' },
        { id: '4:5', label: '4:5' },
        { id: '9:16', label: '9:16' },
        { id: '16:9', label: '16:9' },
    ];


    return (
        <div className="w-full max-w-5xl my-6 space-y-8">
            {/* Step 1 */}
            <div>
                <h3 className="text-lg font-semibold text-center text-slate-400 mb-4">Langkah 1: Pilih Jenis Restorasi Dasar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {baseOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onBaseOptionChange(option.id)}
                            className={buttonClass(baseOption === option.id) + ' p-6'}
                            aria-pressed={baseOption === option.id}
                        >
                            <div className="flex justify-center">{option.icon}</div>
                            <h4 className="font-bold text-lg text-slate-100">{option.title}</h4>
                            <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2 */}
            <div>
                <h3 className="text-lg font-semibold text-center text-slate-400 mb-4">Langkah 2: (Opsional) Tambahkan Fitur</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {additiveOptionsList.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleAdditiveChange(option.id)}
                            className={buttonClass(additiveOptions[option.id]) + ' p-6'}
                            aria-pressed={additiveOptions[option.id]}
                        >
                            <div className="flex justify-center">{option.icon}</div>
                            <h4 className="font-bold text-lg text-slate-100">{option.title}</h4>
                            <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Step 3 */}
            <div>
                <h3 className="text-lg font-semibold text-center text-slate-400 mb-4">Langkah 3: (Opsional) Sesuaikan Detail</h3>
                <div className="space-y-4">
                    {additiveOptions.full_body && (
                         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <h4 className="font-semibold text-amber-400 mb-2">Opsi 'Buat Seluruh Badan'</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="pose-prompt" className="block text-sm font-medium text-slate-300 mb-1">Jelaskan Pose (Opsional)</label>
                                    <input 
                                        type="text"
                                        id="pose-prompt"
                                        value={posePrompt}
                                        onChange={(e) => onPosePromptChange(e.target.value)}
                                        placeholder="contoh: berdiri dengan tangan di saku"
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="background-prompt" className="block text-sm font-medium text-slate-300 mb-1">Jelaskan Latar Belakang (Opsional)</label>
                                    <input 
                                        type="text"
                                        id="background-prompt"
                                        value={backgroundPrompt}
                                        onChange={(e) => onBackgroundPromptChange(e.target.value)}
                                        placeholder="contoh: di taman dengan bunga"
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                     {additiveOptions.change_clothes && (
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                             <label htmlFor="clothing-prompt" className="block text-sm font-medium text-slate-300 mb-1 font-semibold text-amber-400">Jelaskan Pakaian Baru</label>
                            <input 
                                type="text"
                                id="clothing-prompt"
                                value={clothingPrompt}
                                onChange={(e) => onClothingPromptChange(e.target.value)}
                                placeholder="contoh: kemeja batik lengan panjang berwarna biru"
                                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500"
                                required
                            />
                        </div>
                    )}

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                         <label htmlFor="custom-prompt" className="block text-sm font-medium text-slate-300 mb-2 font-semibold text-amber-400">
                            Instruksi Kustom
                         </label>
                         <textarea 
                            id="custom-prompt"
                            value={customPrompt}
                            onChange={(e) => onCustomPromptChange(e.target.value)}
                            placeholder="contoh: ubah warna mata menjadi biru, tambahkan sedikit senyuman"
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500"
                            rows={3}
                        />
                         <p className="text-xs text-slate-500 mt-2">Berikan instruksi tambahan kepada AI. Ini dapat memengaruhi hasil restorasi lainnya.</p>
                    </div>
                </div>
            </div>

             {/* Step 4 */}
            <div>
                <h3 className="text-lg font-semibold text-center text-slate-400 mb-4">Langkah 4: Pengaturan Output (Opsional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-amber-400 mb-3 text-center">Kualitas Kamera</h4>
                        <div className="grid grid-cols-3 gap-2">
                             {cameraQualityOptions.map(option => (
                                <button key={option.id} onClick={() => onCameraQualityChange(option.id)} className={buttonClass(cameraQuality === option.id) + ' text-sm'}>
                                    {option.label}
                                </button>
                             ))}
                        </div>
                    </div>
                     <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-amber-400 mb-3 text-center">Sudut Kamera</h4>
                        <div className="grid grid-cols-4 gap-2">
                             {cameraAngleOptions.map(option => (
                                <button key={option.id} onClick={() => onCameraAngleChange(option.id)} className={buttonClass(cameraAngle === option.id) + ' text-sm'}>
                                    {option.label}
                                </button>
                             ))}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-amber-400 mb-3 text-center">Rasio Aspek</h4>
                        <div className="grid grid-cols-3 gap-2">
                             {aspectRatioOptions.map(option => (
                                <button key={option.id} onClick={() => onAspectRatioChange(option.id)} className={buttonClass(aspectRatio === option.id) + ' text-sm'}>
                                    {option.label}
                                </button>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};