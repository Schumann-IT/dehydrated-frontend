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
import { Theme, ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { getTheme } from "@/theme";

export const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mode, setMode] = useState<"light" | "dark">(
    import.meta.env.VITE_THEME_MODE || "light",
  );
  const [themes, setThemes] = useState<{
    light: Theme;
    dark: Theme;
  }>();

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const loadedThemes = await getTheme("default");
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

  return (
    <ThemeProvider theme={themes[mode]}>
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
