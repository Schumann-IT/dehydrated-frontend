import { Card, CardContent } from "@mui/material";
import { Title } from "react-admin";
import { UserTokenInfo } from "./UserTokenInfo";

export const Dashboard = () => (
  <Card>
    <Title title="Dashboard" />
    <CardContent>
      <UserTokenInfo />
    </CardContent>
  </Card>
);
