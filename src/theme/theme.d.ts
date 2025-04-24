import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    assets: {
      wallpaper: string;
    };
  }

  interface ThemeOptions {
    assets?: {
      wallpaper?: string;
    };
  }
}
