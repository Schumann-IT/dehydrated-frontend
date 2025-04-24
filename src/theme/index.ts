import { ThemeOptions } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultLightTheme } from "react-admin";
import { createTheme } from "@mui/material";

export const defaultThemeOptions: CustomThemeOptions = {
  assets: {
    wallpaper: "",
  },
  texts: {
    title: "Dehydrated API frontend",
  },
};

export interface CustomThemeOptions extends ThemeOptions {
  assets?: {
    wallpaper: string;
  };
  texts?: {
    title: string;
  };
}

export type ThemeVariant = "standard" | "hansemerkur";

const baseLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },
  },
});

const baseDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#e3f2fd",
      dark: "#42a5f5",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    secondary: {
      main: "#ce93d8",
      light: "#f3e5f5",
      dark: "#ab47bc",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
  },
});

const themes = {
  standard: {
    light: deepmerge(
      deepmerge(baseLightTheme, defaultLightTheme),
      defaultThemeOptions,
    ),
    dark: deepmerge(
      deepmerge(baseDarkTheme, defaultDarkTheme),
      defaultThemeOptions,
    ),
  },
  hansemerkur: {
    light: deepmerge(deepmerge(baseLightTheme, defaultLightTheme), {
      ...defaultThemeOptions,
      palette: {
        primary: {
          main: "#007A33",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#005C2E",
          contrastText: "#ffffff",
        },
      },
      assets: {
        wallpaper: "/assets/images/wallpaper.jpg",
      },
      texts: {
        title: "Hansemerkur Certificate Management",
      },
    }),
    dark: deepmerge(deepmerge(baseDarkTheme, defaultDarkTheme), {
      ...defaultThemeOptions,
      palette: {
        primary: {
          main: "#00C781",
          contrastText: "#000000",
        },
        secondary: {
          main: "#009E60",
          contrastText: "#000000",
        },
      },
      assets: {
        wallpaper: "/assets/images/wallpaper.jpg",
      },
      texts: {
        title: "Hansemerkur Certificate Management",
      },
    }),
  },
} as const;

export const getTheme = (variant: ThemeVariant = "standard") => {
  return themes[variant];
};
