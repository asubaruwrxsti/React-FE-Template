/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly VITE_APP_AUTHOR: string;
    readonly VITE_APP_COPYRIGHT: string;
    readonly VITE_APP_LOGO: string;
    readonly VITE_APP_FAVICON: string;
    readonly VITE_APP_THEME: string;
    readonly VITE_APP_LANGUAGE: string;
    readonly VITE_CURRENCY: string;
    readonly VITE_CURRENCY_ICON: string;
    readonly VITE_FEATURE_DARK_MODE: string;
    readonly VITE_FEATURE_NOTIFICATIONS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
