import { msalAuthProvider } from "ra-auth-msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const myMSALObj = new PublicClientApplication(msalConfig);

export const provider = msalAuthProvider({
  msalInstance: myMSALObj,
});
