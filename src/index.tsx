import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { App } from "@/pages/App";
import { myMSALObj } from "@/auth";

// Check if MSAL is enabled
const isMsalEnabled = import.meta.env.VITE_ENABLE_MSAL === "true";

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
