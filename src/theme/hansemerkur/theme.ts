import { ThemeOptions } from "@mui/material";
import wallpaper from "./wallpaper.jpg";

// TODO: import from main app
export interface CustomThemeOptions extends ThemeOptions {
  assets: {
    wallpaper: string;
  };
  home?: {
    box?: {
      color?: string;
      display?: string;
      flexDirection?: string;
      alignItems?: string;
      textAlign?: string;
      gap?: number;
      backgroundColor?: string;
      backgroundImage?: string;
      backdropFilter?: string;
      padding?: number;
      borderRadius?: number;
      boxShadow?: string;
      border?: string;
      position?: string;
      left?: string;
      [key: string]: string | number | undefined;
    };
  };
  texts: {
    title: string;
    dashboard?: {
      content: string;
    };
  };
}

export const commonSettings: Partial<CustomThemeOptions> = {
  typography: {
    fontFamily: '"Metric", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 700, fontSize: "2rem" },
    body1: { fontSize: "1rem" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#005E52",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: "#003366",
        },
        h2: {
          color: "#ffffff",
        },
        h3: {
          color: "#4D94FF",
        },
      },
    },
  },
  assets: {
    wallpaper: wallpaper,
  },
  home: {
    box: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 4,
      color: "#fffff",
      backgroundImage:
        "linear-gradient(30deg, #005e52 0%, #005e52 10%, rgba(0,160,117,0.85) 80%, rgba(0,160,117,0.8) 100%)",
      padding: 6,
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0, 51, 102, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative",
      left: "350px",
    },
  },
  texts: {
    title: "Hansemerkur Certificate Management",
    dashboard: {
      content: `
## Certificate management

TBD

### Usage

TBD

### Terraform integration

TBD
`,
    },
  },
};
