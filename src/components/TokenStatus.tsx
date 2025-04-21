import { Alert, CircularProgress, Box } from "@mui/material";
import { useCustomApiToken } from "../hooks/useCustomApiToken";

export const TokenStatus = () => {
  const { token, isLoading, error, refreshToken } = useCustomApiToken();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <span>Loading API token...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
        action={
          <button
            onClick={() => refreshToken()}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Retry
          </button>
        }
      >
        Failed to load API token: {error}
      </Alert>
    );
  }

  if (token) {
    return (
      <Alert severity="success" sx={{ m: 2 }}>
        API token loaded successfully
      </Alert>
    );
  }

  return null;
};
