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
      <TextField source="domain" label="Domain" />
      <TextField source="alias" label="Alias" />
      <BooleanField source="enabled" label="Enabled" />
      <TextField source="comment" label="Comment" />
      <FunctionField
        source="alternativeNames"
        label="Alternative Names"
        render={(record) =>
          record.alternativeNames && record.alternativeNames.length > 0 ? (
            record.alternativeNames.map((name: string) => (
              <ListItem key={name}>{name}</ListItem>
            ))
          ) : (
            <span style={{ color: '#999' }}>No alternative names</span>
          )
        }
      />
      <FunctionField
        source="metadata"
        label="Metadata"
        render={(record) => 
          record.metadata && Object.keys(record.metadata).length > 0 ? (
            <pre>{JSON.stringify(record.metadata, null, 2)}</pre>
          ) : (
            <span style={{ color: '#999' }}>No metadata</span>
          )
        }
      />
    </SimpleShowLayout>
  </Show>
);
