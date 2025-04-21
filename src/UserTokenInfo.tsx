import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import { TokenStatus } from "./components/TokenStatus.tsx";

// Create MSAL instance
const myMSALObj = new PublicClientApplication(msalConfig);

// Function to decode JWT token
const decodeToken = (token: string) => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { error: "Invalid token format" };
    }

    // Decode the payload (second part)
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return { error: "Failed to decode token" };
  }
};

export const UserTokenInfo = () => {
  const [tokenInfo, setTokenInfo] = useState<{
    accessToken?: string;
    idToken?: string;
    accessTokenDecoded?: any;
    idTokenDecoded?: any;
    customApiToken?: string;
    customApiTokenDecoded?: any;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customApi, setCustomApi] = useState<string>(
    "api://6c091a3e-aed9-4bdc-936c-134ef57f75e6",
  );

  // Initialize MSAL on component mount
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await myMSALObj.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing MSAL:", error);
        setError("Error initializing MSAL. Check console for details.");
      }
    };

    initializeMsal();
  }, []);

  const handleShowToken = async () => {
    if (!isInitialized) {
      setError("MSAL is not initialized yet. Please wait or refresh the page.");
      return;
    }

    const account = myMSALObj.getAllAccounts()[0];
    if (account) {
      try {
        const tokenResponse = await myMSALObj.acquireTokenSilent({
          scopes: ["user.read"],
          account: account,
        });

        // Decode the tokens
        const accessTokenDecoded = decodeToken(tokenResponse.accessToken);
        const idTokenDecoded = decodeToken(tokenResponse.idToken);

        setTokenInfo({
          accessToken: tokenResponse.accessToken,
          idToken: tokenResponse.idToken,
          accessTokenDecoded,
          idTokenDecoded,
        });
        setError(null);
      } catch (error) {
        console.error("Error getting token:", error);
        setError("Error getting token. Check console for details.");
      }
    } else {
      setError("No account found. Please log in.");
    }
  };

  const handleGetCustomApiToken = async () => {
    if (!isInitialized) {
      setError("MSAL is not initialized yet. Please wait or refresh the page.");
      return;
    }

    const account = myMSALObj.getAllAccounts()[0];
    if (account) {
      try {
        // Format the API scope correctly
        const apiScope = customApi.endsWith("/") ? customApi : `${customApi}/`;

        const tokenResponse = await myMSALObj.acquireTokenSilent({
          scopes: [`${apiScope}access_as_user`],
          account: account,
        });

        // Decode the token
        const customApiTokenDecoded = decodeToken(tokenResponse.accessToken);

        setTokenInfo((prev) => ({
          ...prev,
          customApiToken: tokenResponse.accessToken,
          customApiTokenDecoded,
        }));
        setError(null);
      } catch (error) {
        console.error("Error getting custom API token:", error);
        setError("Error getting custom API token. Check console for details.");
      }
    } else {
      setError("No account found. Please log in.");
    }
  };

  // Function to render JSON object in a readable format
  const renderJsonObject = (obj: any) => {
    return (
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "12px",
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(obj, null, 2)}
      </pre>
    );
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          User Token Information
        </Typography>
        <TokenStatus />
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowToken}
          sx={{ mb: 2 }}
          disabled={!isInitialized}
        >
          {isInitialized ? "Show Token Info" : "Initializing..."}
        </Button>

        <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center" }}>
          <TextField
            label="Custom API"
            variant="outlined"
            value={customApi}
            onChange={(e) => setCustomApi(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGetCustomApiToken}
            disabled={!isInitialized}
          >
            Get API Token
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {tokenInfo.accessToken && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Access Token</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Raw Token:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "10px",
                  maxHeight: "100px",
                  overflow: "auto",
                }}
              >
                {tokenInfo.accessToken}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Decoded Payload:
              </Typography>
              {renderJsonObject(tokenInfo.accessTokenDecoded)}
            </AccordionDetails>
          </Accordion>
        )}

        {tokenInfo.idToken && (
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">ID Token</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Raw Token:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "10px",
                  maxHeight: "100px",
                  overflow: "auto",
                }}
              >
                {tokenInfo.idToken}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Decoded Payload:
              </Typography>
              {renderJsonObject(tokenInfo.idTokenDecoded)}
            </AccordionDetails>
          </Accordion>
        )}

        {tokenInfo.customApiToken && (
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Custom API Token</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Raw Token:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "10px",
                  maxHeight: "100px",
                  overflow: "auto",
                }}
              >
                {tokenInfo.customApiToken}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Decoded Payload:
              </Typography>
              {renderJsonObject(tokenInfo.customApiTokenDecoded)}
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};
