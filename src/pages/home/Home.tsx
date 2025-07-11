import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/authConfig.ts";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { CustomThemeOptions } from "@/theme";

// Check if MSAL is enabled
const isMsalEnabled = import.meta.env.VITE_ENABLE_MSAL === "true";

export const Home = () => {
  const { instance } = useMsal();
  const theme = useTheme() as CustomThemeOptions;

  const handleLogin = () => {
    if (isMsalEnabled && instance) {
      instance.loginRedirect(loginRequest).catch((error) => {
        console.error("Login failed:", error);
      });
    }
  };

  const handleGoToAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${theme.assets?.wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ width: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            padding: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            {theme.texts?.title}
          </Typography>
          {isMsalEnabled ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{ mt: 4 }}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToAdmin}
              sx={{ mt: 4 }}
            >
              Go to Admin
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
