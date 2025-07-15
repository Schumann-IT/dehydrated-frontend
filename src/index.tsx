import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { App } from "@/pages/App";
import { myMSALObj } from "@/auth";
import { loadRuntimeEnv, getEnvVar } from "@/utils/env";

// Load runtime environment variables and then render the app
const initializeApp = async () => {
  // Load runtime environment variables
  await loadRuntimeEnv();

  // Check if MSAL is enabled (now using the utility function)
  const isMsalEnabled = getEnvVar("VITE_ENABLE_MSAL") === "true";

  const AppWrapper = () => {
    if (isMsalEnabled && myMSALObj) {
      return (
        <MsalProvider instance={myMSALObj}>
          <App />
        </MsalProvider>
      );
    }
    return <App />;
  };

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>,
  );
};

// Initialize the app
initializeApp().catch(console.error);
