/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SME_CDEP_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
