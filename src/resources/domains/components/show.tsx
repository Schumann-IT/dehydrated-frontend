import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  FunctionField,
} from "react-admin";
import { ListItem } from "@mui/material";

export const DomainShow = () => (
  <Show
    actions={
      <>
        <EditButton />
        <DeleteButton />
      </>
    }
  >
    <SimpleShowLayout>
      <TextField source="domain" />
      <BooleanField source="enabled" />
      <TextField source="comment" />
      <FunctionField
        source="alternativeNames"
        render={(record) =>
          record.alternativeNames.map((name: string) => (
            <ListItem key={name}>{name}</ListItem>
          ))
        }
      />
      <FunctionField
        source="metadata"
        render={(record) => JSON.stringify(record.metadata, null, 2)}
        component="pre"
      />
    </SimpleShowLayout>
  </Show>
);
