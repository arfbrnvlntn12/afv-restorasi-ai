
import React, { useState, useCallback } from 'react';
import { restorePhoto, BaseRestorationType, AdditiveOptions, CameraQuality, CameraAngle, AspectRatio } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { RestorationOptions } from './components/RestorationOptions';
import { ImagePreviewModal } from './components/ImagePreviewModal';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [baseRestorationType, setBaseRestorationType] = useState<BaseRestorationType>('enhance');
  const [additiveOptions, setAdditiveOptions] = useState<AdditiveOptions>({
    passport: false,
    full_body: false,
    change_clothes: false,
  });
  const [clothingPrompt, setClothingPrompt] = useState<string>('');
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('');
  const [posePrompt, setPosePrompt] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [cameraQuality, setCameraQuality] = useState<CameraQuality>('default');
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('default');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('default');

  const handleImageUpload = useCallback((file: File) => {
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setRestoredImage(null);
      setAppState('idle');
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRestore = async () => {
    if (!originalImage) return;
    if (additiveOptions.change_clothes && !clothingPrompt.trim()) {
        setErrorMessage("Please describe the clothing you want to generate.");
        setAppState('error');
        return;
    }

    setAppState('loading');
    setErrorMessage('');
    setRestoredImage(null);

    try {
      const mimeType = originalFile?.type;
      if (!mimeType) throw new Error("Could not determine image mime type.");

      const base64Data = originalImage.split(',')[1];
      
      const restoredBase64 = await restorePhoto(
        base64Data, 
        mimeType, 
        baseRestorationType, 
        additiveOptions,
        clothingPrompt,
        backgroundPrompt,
        posePrompt,
        customPrompt,
        cameraQuality,
        cameraAngle,
        aspectRatio
      );
      
      if (restoredBase64) {
        setRestoredImage(`data:image/png;base64,${restoredBase64}`);
        setAppState('success');
      } else {
        throw new Error("The AI model did not return an image. Please try again.");
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      if (message.includes('API key not valid')) {
        setErrorMessage(`Restorasi gagal: API Key tidak valid atau tidak dikonfigurasi dengan benar.`);
      } else {
        setErrorMessage(`Restorasi gagal: ${message}`);
      }
      setAppState('error');
    }
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setRestoredImage(null);
    setOriginalFile(null);
    setAppState('idle');
    setErrorMessage('');
    setBaseRestorationType('enhance');
    setAdditiveOptions({ passport: false, full_body: false, change_clothes: false });
    setClothingPrompt('');
    setBackgroundPrompt('');
    setPosePrompt('');
    setCustomPrompt('');
    setCameraQuality('default');
    setCameraAngle('default');
    setAspectRatio('default');
  };

  const isRestoreDisabled = appState === 'loading' || (additiveOptions.change_clothes && !clothingPrompt.trim());

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-full grid grid-cols-2 gap-4 md:gap-8 mb-6 sticky top-0 z-10 bg-slate-900 py-4">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold text-slate-400 mb-3">Original</h2>
                <img src={originalImage} alt="Original" className="rounded-lg shadow-lg object-contain max-h-[30vh] md:max-h-[50vh]"/>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold text-slate-400 mb-3">Restored</h2>
                <div className="w-full h-full bg-slate-800/50 rounded-lg shadow-lg flex items-center justify-center border-2 border-dashed border-slate-700">
                  {appState === 'loading' && <Loader />}
                  {appState === 'error' && <p className="text-red-400 text-center p-4">{errorMessage}</p>}
                  {restoredImage && appState === 'success' && (
                     <img 
                      src={restoredImage} 
                      alt="Restored" 
                      className="rounded-lg object-contain max-h-[30vh] md:max-h-[50vh] cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setIsModalOpen(true)}
                     />
                  )}
                </div>
              </div>
            </div>

            <RestorationOptions 
              baseOption={baseRestorationType}
              onBaseOptionChange={setBaseRestorationType}
              additiveOptions={additiveOptions}
              onAdditiveOptionsChange={setAdditiveOptions}
              clothingPrompt={clothingPrompt}
              onClothingPromptChange={setClothingPrompt}
              backgroundPrompt={backgroundPrompt}
              onBackgroundPromptChange={setBackgroundPrompt}
              posePrompt={posePrompt}
              onPosePromptChange={setPosePrompt}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
              cameraQuality={cameraQuality}
              onCameraQualityChange={setCameraQuality}
              cameraAngle={cameraAngle}
              onCameraAngleChange={setCameraAngle}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
            />

            <div className="flex flex-wrap gap-4 mt-4">
               <button 
                onClick={handleRestore}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                disabled={isRestoreDisabled}
              >
                <SparklesIcon />
                {restoredImage ? 'Generate Again' : 'Generate'}
              </button>
              {restoredImage && <ResultsDisplay restoredImage={restoredImage} onReset={handleReset}/>}
              {!restoredImage &&  <button 
                onClick={handleReset}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-800 disabled:cursor-not-allowed"
                disabled={appState === 'loading'}
              >
                Choose a different photo
              </button>}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm mt-8">
        <p>Powered by Google's Gemini API. Images are not stored.</p>
      </footer>
      <ImagePreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={restoredImage}
      />
    </div>
  );
}
