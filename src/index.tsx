import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { App } from "@/pages/App";
import { myMSALObj } from "@/auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={myMSALObj}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
);
