import { msalAuthProvider } from "ra-auth-msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/authConfig";

export * from "./components";

export const myMSALObj = new PublicClientApplication(msalConfig);

// Initialize MSAL
export const initializeMsal = async () => {
  await myMSALObj.initialize();
};

const baseProvider = msalAuthProvider({
  msalInstance: myMSALObj,
});

export const provider = {
  ...baseProvider,
  logout: async (params = {}) => {
    // First clear the local auth state
    await baseProvider.logout(params);
    // Then redirect to the landing page
    window.location.href = "/";
    return Promise.resolve();
  },
};
