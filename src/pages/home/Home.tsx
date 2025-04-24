import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/authConfig.ts";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";

export const Home = () => {
  const { instance } = useMsal();
  const theme = useTheme();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${theme.assets.wallpaper})`,
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
            {theme.texts.title}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ mt: 4 }}
          >
            Login with Microsoft
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
