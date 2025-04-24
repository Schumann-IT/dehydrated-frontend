import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { App } from "./App";
import { myMSALObj } from "./auth-providers/msal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={myMSALObj}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
);
