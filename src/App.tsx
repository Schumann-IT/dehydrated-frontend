import { Admin, Resource } from "react-admin";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "ra-auth-msal";
import { provider as msalProvider } from "./auth-providers/msal";
import { Dashboard } from "./Dashboard";
import { useDataProvider } from "./data-providers";
import { DomainList } from "./resources/domains/DomainList.tsx";
import { DomainShow } from "./resources/domains/DomainShow.tsx";
import { DomainEdit } from "./resources/domains/DomainEdit.tsx";
import { DomainCreate } from "./resources/domains/DomainCreate.tsx";

export const App = () => {
  const dataProvider = useDataProvider();

  return (
    <BrowserRouter>
      <Admin
        dataProvider={dataProvider}
        authProvider={msalProvider}
        loginPage={LoginPage}
        dashboard={Dashboard}
      >
        <Resource
          name="domains"
          list={DomainList}
          edit={DomainEdit}
          show={DomainShow}
          create={DomainCreate}
        />
      </Admin>
    </BrowserRouter>
  );
};
