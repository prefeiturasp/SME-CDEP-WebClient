/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SME_CDEP_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};

declare global {
  interface Window {
    clarity: (identify: string, value: any) => void;
  }
}
