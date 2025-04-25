import { Card, CardContent, useTheme } from "@mui/material";
import { Title } from "react-admin";
import ReactMarkdown from "react-markdown";
import { CustomThemeOptions } from "@/theme";

export const Dashboard = () => {
  const theme = useTheme() as CustomThemeOptions;

  return (
    <Card>
      <Title title="Dashboard" />
      <CardContent>
        <ReactMarkdown>{theme.texts?.dashboard.content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};
