import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/authConfig.ts";
import { Box, Button, Container, Typography } from "@mui/material";

export const Home = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Dehydrated
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your DNS Management Solution
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
  );
};
