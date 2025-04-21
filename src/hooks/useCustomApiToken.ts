import { useState, useEffect, useCallback } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";

// Create MSAL instance
const myMSALObj = new PublicClientApplication(msalConfig);

// Default API identifier
const DEFAULT_API_IDENTIFIER = "api://6c091a3e-aed9-4bdc-936c-134ef57f75e6";

// Token cache
let tokenCache: {
  token: string | null;
  expiresOn: number | null;
  error: string | null;
} = {
  token: null,
  expiresOn: null,
  error: null,
};

// MSAL initialization state
let isMsalInitialized = false;

export const useCustomApiToken = (
  apiIdentifier: string = DEFAULT_API_IDENTIFIER,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize MSAL
  useEffect(() => {
    const initializeMsal = async () => {
      if (isMsalInitialized) {
        setIsInitialized(true);
        return;
      }

      try {
        await myMSALObj.initialize();
        isMsalInitialized = true;
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing MSAL:", error);
        setError("Error initializing MSAL. Check console for details.");
      }
    };

    initializeMsal();
  }, []);

  // Function to fetch the token
  const fetchToken = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!isInitialized) {
        setError("MSAL is not initialized yet. Please wait or refresh the page.");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const account = myMSALObj.getAllAccounts()[0];
        if (!account) {
          throw new Error("No account found. Please log in.");
        }

        // Check if we have a cached token that's still valid
        const now = Date.now();
        if (
          !forceRefresh &&
          tokenCache.token &&
          tokenCache.expiresOn &&
          tokenCache.expiresOn > now
        ) {
          setToken(tokenCache.token);
          setIsLoading(false);
          return tokenCache.token;
        }

        // Format the API scope correctly
        const apiScope = apiIdentifier.endsWith("/")
          ? apiIdentifier
          : `${apiIdentifier}/`;

        // Fetch the token
        const tokenResponse = await myMSALObj.acquireTokenSilent({
          scopes: [`${apiScope}access_as_user`],
          account: account,
        });

        // Calculate expiration time (subtract 5 minutes for safety margin)
        // expiresOn is in seconds, convert to milliseconds
        const expiresOnTimestamp = tokenResponse.expiresOn
          ? Number(tokenResponse.expiresOn) * 1000
          : 0;
        const expiresOn =
          expiresOnTimestamp > 0 ? expiresOnTimestamp - 5 * 60 * 1000 : 0;

        // Update cache
        tokenCache = {
          token: tokenResponse.accessToken,
          expiresOn,
          error: null,
        };

        setToken(tokenResponse.accessToken);
        setIsLoading(false);
        return tokenResponse.accessToken;
      } catch (error) {
        console.error("Error getting custom API token:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        tokenCache.error = errorMessage;
        setIsLoading(false);
        return null;
      }
    },
    [apiIdentifier, isInitialized],
  );

  // Initial token fetch
  useEffect(() => {
    if (isInitialized) {
      fetchToken();
    }
  }, [fetchToken, isInitialized]);

  // Function to force refresh the token
  const refreshToken = useCallback(() => {
    return fetchToken(true);
  }, [fetchToken]);

  return {
    token,
    isLoading: isLoading || !isInitialized,
    error,
    refreshToken,
  };
};
