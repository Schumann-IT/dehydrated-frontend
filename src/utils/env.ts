// Environment variable utility that supports both development and production
export interface EnvConfig {
  VITE_APP_BASE_URI?: string;
  VITE_API_BASE_URL?: string;
  VITE_ENABLE_MSAL?: string;
  VITE_THEME_NAME?: string;
  VITE_THEME_MODE?: string;
  VITE_MSAL_CLIENT_ID?: string;
  VITE_MSAL_AUTHORITY?: string;
  VITE_DEHYDRATED_API_IDENTIFIER?: string;
}

// Extend Window interface to include our runtime config
declare global {
  interface Window {
    ENV_CONFIG?: EnvConfig;
  }
}

// Get environment variable with fallback to build-time in development
export const getEnvVar = (key: keyof EnvConfig): string | undefined => {
  // In development, try runtime first, then fallback to build-time
  if (import.meta.env.DEV) {
    // First try runtime environment variable from window.ENV_CONFIG
    if (typeof window !== "undefined" && window.ENV_CONFIG) {
      return window.ENV_CONFIG[key];
    }

    // Fallback to build-time environment variable in development
    return import.meta.env[key];
  }

  // In production, only use runtime environment variable from window.ENV_CONFIG
  if (typeof window !== "undefined" && window.ENV_CONFIG) {
    return window.ENV_CONFIG[key];
  }

  return undefined;
};

// Load runtime environment variables
export const loadRuntimeEnv = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return; // Server-side rendering
  }

  // In development, we don't need to load runtime variables
  if (import.meta.env.DEV) {
    return;
  }

  try {
    // Check if runtime config is already loaded
    if (window.ENV_CONFIG) {
      return;
    }

    // Load runtime environment variables
    const response = await fetch("/env-config.js");
    if (response.ok) {
      const script = document.createElement("script");
      script.src = "/env-config.js";
      document.head.appendChild(script);

      // Wait for the script to load and execute
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load env-config.js"));
      });
    }
  } catch (error) {
    console.warn("Failed to load runtime environment variables:", error);
  }
};
