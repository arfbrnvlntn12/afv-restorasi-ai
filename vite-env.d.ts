// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    // tambahkan env variables lain jika ada
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
