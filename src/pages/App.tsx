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

export const App = () => {
  return (
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
  );
};
