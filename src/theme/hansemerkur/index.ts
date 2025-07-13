import { createTheme } from "@mui/material";
import { commonSettings } from "./theme";

// Light theme
export const light = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#005E52",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#424242",
    },
  },
  ...commonSettings,
});

// Dark theme
export const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4D94FF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#0066CC",
      contrastText: "#000000",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0BEC5",
    },
  },
  ...commonSettings,
});
