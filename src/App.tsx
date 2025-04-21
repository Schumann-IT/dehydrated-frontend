import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "ra-auth-msal";
import { authProvider } from "./authProvider";
import { Dashboard } from "./Dashboard";
import { mockDataProvider } from "./mockDataProvider.ts";

// Create the data provider factory
//const dataProviderFactory = createDataProvider("http://localhost:3000");

export const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={mockDataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      dashboard={Dashboard}
    >
      <Resource
        name="domains"
        list={ListGuesser}
        edit={EditGuesser}
        show={ShowGuesser}
      />
    </Admin>
  </BrowserRouter>
);
