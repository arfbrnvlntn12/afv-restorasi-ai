import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySubmit: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold text-center text-amber-400 mb-2">Masukkan API Key Gemini Anda</h1>
        <p className="text-slate-400 text-center mb-6">Untuk menggunakan aplikasi ini, Anda memerlukan Google AI Gemini API key Anda sendiri. Kunci Anda disimpan dengan aman di browser Anda dan tidak pernah dibagikan.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-slate-300 mb-1">
              API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Masukkan API Key Anda di sini"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            disabled={!apiKey.trim()}
          >
            Simpan & Mulai
          </button>
        </form>
         <p className="text-xs text-slate-500 text-center mt-4">
          Belum punya kunci? Dapatkan dari <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};
