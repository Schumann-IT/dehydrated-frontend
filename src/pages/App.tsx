import React from "react";
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
import { dataProvider } from "@/dataProvider";
import { Theme, ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { useEffect, useState, Suspense, lazy } from "react";
import { getTheme } from "@/theme";
import { getEnvVar } from "@/utils/env";

// Lazy load components
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((module) => ({ default: module.Dashboard })),
);
const Home = lazy(() =>
  import("@/pages/home").then((module) => ({ default: module.Home })),
);
const DomainList = lazy(() =>
  import("@/resources/domains").then((module) => ({
    default: module.DomainList,
  })),
);
const DomainShow = lazy(() =>
  import("@/resources/domains").then((module) => ({
    default: module.DomainShow,
  })),
);
const DomainEdit = lazy(() =>
  import("@/resources/domains").then((module) => ({
    default: module.DomainEdit,
  })),
);
const DomainCreate = lazy(() =>
  import("@/resources/domains").then((module) => ({
    default: module.DomainCreate,
  })),
);
const InvalidDomainList = lazy(() =>
  import("@/resources/domains").then((module) => ({
    default: module.InvalidDomainList,
  })),
);

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: "#666",
    }}
  >
    Loading...
  </div>
);

// Check if MSAL is enabled via environment variable
const isMsalEnabled = getEnvVar("VITE_ENABLE_MSAL") === "true";

export const App = () => {
  const [mode] = useState<"light" | "dark">(
    (getEnvVar("VITE_THEME_MODE") as "light" | "dark") || "light",
  );
  const [themes, setThemes] = useState<{
    light: Theme;
    dark: Theme;
  }>();

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const loadedThemes = await getTheme(
          getEnvVar("VITE_THEME_NAME") || "default",
        );
        setThemes(loadedThemes);
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadThemes();
  }, []);

  if (!themes) {
    return <LoadingSpinner />;
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

  // Create the data provider with MSAL instance if enabled
  const dataProviderWithAuth = dataProvider(
    isMsalEnabled && myMSALObj ? myMSALObj : undefined,
  );

  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />
      <AuthWrapper>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
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
                      dataProvider={dataProviderWithAuth}
                      authProvider={msalProvider}
                      loginPage={isMsalEnabled ? LoginPage : undefined}
                      dashboard={Dashboard}
                      basename="/admin"
                      lightTheme={themes["light"]}
                      darkTheme={themes["dark"]}
                      disableTelemetry={true}
                      a
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
          </Suspense>
        </BrowserRouter>
      </AuthWrapper>
    </ThemeProvider>
  );
};
