import { msalAuthProvider } from "ra-auth-msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/authConfig";

export * from "./components";

// Check if MSAL is enabled via environment variable
const isMsalEnabled = import.meta.env.VITE_ENABLE_MSAL === "true";

export const myMSALObj = isMsalEnabled
  ? new PublicClientApplication(msalConfig)
  : null;

// Initialize MSAL only if enabled
export const initializeMsal = async () => {
  if (isMsalEnabled && myMSALObj) {
    await myMSALObj.initialize();
  }
};

// Create MSAL provider only if enabled
const baseProvider =
  isMsalEnabled && myMSALObj
    ? msalAuthProvider({
        msalInstance: myMSALObj as unknown as Parameters<
          typeof msalAuthProvider
        >[0]["msalInstance"],
      })
    : null;

// No-auth provider for development
const noAuthProvider = {
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  checkError: async () => Promise.resolve(),
  checkAuth: async () => Promise.resolve(),
  getPermissions: async () => Promise.resolve(),
  getIdentity: async () =>
    Promise.resolve({
      id: "dev-user",
      fullName: "Development User",
    }),
};

export const provider =
  isMsalEnabled && baseProvider
    ? {
        ...baseProvider,
        logout: async (params = {}) => {
          // First clear the local auth state
          await baseProvider.logout(params);
          // Then redirect to the landing page
          window.location.href = "/";
          return Promise.resolve();
        },
      }
    : noAuthProvider;
