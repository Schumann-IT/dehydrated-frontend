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
  InvalidDomainList,
} from "@/resources/domains";
import { Home } from "@/pages/home";
import { dataProvider } from "@/dataProvider.ts";
import { Theme, ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { getTheme } from "@/theme";

// Check if MSAL is enabled
const isMsalEnabled = import.meta.env.VITE_ENABLE_MSAL === "true";

export const App = () => {
  const [mode] = useState<"light" | "dark">(
    import.meta.env.VITE_THEME_MODE || "light",
  );
  const [themes, setThemes] = useState<{
    light: Theme;
    dark: Theme;
  }>();

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const loadedThemes = await getTheme(
          import.meta.env.VITE_THEME_NAME || "default",
        );
        setThemes(loadedThemes);
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadThemes();
  }, []);

  if (!themes) {
    return null; // or a loading spinner
  }

  // Conditional MSAL wrapper component
  const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isMsalEnabled) {
      return <MsalInitializer>{children}</MsalInitializer>;
    }
    return <>{children}</>;
  };

  // Conditional protected route component
  const ConditionalProtectedRoute = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    if (isMsalEnabled) {
      return <ProtectedRoute>{children}</ProtectedRoute>;
    }
    return <>{children}</>;
  };

  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />
      <AuthWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            {isMsalEnabled && (
              <Route path="/auth-callback" element={<AuthCallback />} />
            )}
            <Route
              path="/admin/*"
              element={
                <ConditionalProtectedRoute>
                  <Admin
                    dataProvider={dataProvider(myMSALObj || undefined)}
                    authProvider={msalProvider}
                    loginPage={isMsalEnabled ? LoginPage : undefined}
                    dashboard={Dashboard}
                    basename="/admin"
                    lightTheme={themes["light"]}
                    darkTheme={themes["dark"]}
                  >
                    <Resource
                      name="domains"
                      list={DomainList}
                      edit={DomainEdit}
                      show={DomainShow}
                      create={DomainCreate}
                    />
                    <Resource
                      name="invalid-domains"
                      options={{ label: "Invalid Domains" }}
                      list={InvalidDomainList}
                    />
                  </Admin>
                </ConditionalProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthWrapper>
    </ThemeProvider>
  );
};
