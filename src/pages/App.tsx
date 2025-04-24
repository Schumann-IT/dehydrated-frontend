import { Admin, Resource } from "react-admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "ra-auth-msal";
import {
  MsalInitializer,
  AuthCallback,
  ProtectedRoute,
  myMSALObj,
  provider as msalProvider,
} from "@/auth";
import { Dashboard } from "@/pages/dashboard";
import {
  DomainList,
  DomainShow,
  DomainEdit,
  DomainCreate,
} from "@/resources/domains";
import { Home } from "@/pages/home";
import { dataProvider } from "@/dataProvider.ts";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo, useState } from "react";
import { getTheme, ThemeVariant } from "@/theme";

// Get theme variant from environment variable, default to "standard"
const themeVariant = (import.meta.env.VITE_THEME_VARIANT ||
  "standard") as ThemeVariant;

export const App = () => {
  // Default to light theme
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Get theme configuration
  const themeConfig = getTheme(themeVariant);

  // Create a theme based on the current mode
  const theme = useMemo(() => themeConfig[mode], [mode, themeConfig]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MsalInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Admin
                    dataProvider={dataProvider(myMSALObj)}
                    authProvider={msalProvider}
                    loginPage={LoginPage}
                    dashboard={Dashboard}
                    basename="/admin"
                    theme={theme}
                  >
                    <Resource
                      name="domains"
                      list={DomainList}
                      edit={DomainEdit}
                      show={DomainShow}
                      create={DomainCreate}
                    />
                  </Admin>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </MsalInitializer>
    </ThemeProvider>
  );
};
