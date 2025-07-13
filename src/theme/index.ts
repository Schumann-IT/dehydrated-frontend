import { deepmerge } from "@mui/utils";
import { createTheme, Theme } from "@mui/material";
import { modules } from "./modules";
import { ThemeModules } from "@/theme/types.ts";

import { defaultDarkTheme, defaultLightTheme } from "react-admin";

const themes: ThemeModules = {
  ...modules,
};

export interface CustomThemeOptions {
  assets?: {
    wallpaper: string;
  };
  home?: {
    box?: {
      display?: string;
      flexDirection?: string;
      alignItems?: string;
      textAlign?: string;
      gap?: number;
      backgroundColor?: string;
      backdropFilter?: string;
      padding?: number;
      borderRadius?: number;
      [key: string]: any;
    };
  };
  texts?: {
    title: string;
    dashboard: {
      content: string;
    };
  };
}

export const defaultThemeOptions: CustomThemeOptions = {
  assets: {
    wallpaper: "",
  },
  home: {
    box: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 4,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      padding: 4,
      borderRadius: 2,
    },
  },
  texts: {
    title: "Dehydrated API frontend",
    dashboard: {
      content: "Welcome to the Dehydrated API frontend.",
    },
  },
};

const baseThemes = {
  light: createTheme({
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
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
        light: "#e3f2fd",
        dark: "#42a5f5",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      secondary: {
        main: "rgb(230,99,99)",
        light: "rgba(228,138,154,0.44)",
        dark: "#e10707",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
    },
  }),
};

const defaultThemes = {
  light: deepmerge(
    defaultThemeOptions,
    deepmerge(baseThemes.light, defaultLightTheme) as Theme,
  ),
  dark: deepmerge(
    defaultThemeOptions,
    deepmerge(baseThemes.dark, defaultDarkTheme) as Theme,
  ),
};

export const getTheme = async (
  variant: string = "default",
): Promise<{
  light: Theme;
  dark: Theme;
}> => {
  const ret: {
    light: Theme;
    dark: Theme;
  } = {
    light: defaultThemes.light as Theme,
    dark: defaultThemes.dark as Theme,
  };

  if (variant === "default") {
    return ret;
  }

  const baseTheme = baseThemes;
  const module = await themes[variant].module;
  if (!module) {
    throw new Error(
      `Theme module ${themes[variant].module} for theme ${variant} not found`,
    );
  }

  const themesConfigs = {
    light: themes[variant]["light"],
    dark: themes[variant]["dark"],
  };

  for (const mode in themesConfigs) {
    const theme = module[
      themes[variant][mode as "light" | "dark"] as string
    ] as Theme;

    if (variant === "default") {
      ret[mode as "light" | "dark"] = theme as Theme;
      continue;
    }

    // First merge the base theme with the requested theme
    const mergedTheme = deepmerge(baseTheme, theme);
    // Then merge with our custom theme options
    ret[mode as "light" | "dark"] = deepmerge(
      defaultThemeOptions,
      mergedTheme,
    ) as Theme;
  }

  return ret;
};
