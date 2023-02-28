/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_RMX_API_BASE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
