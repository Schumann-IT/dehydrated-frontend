import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  TopToolbar,
  EditButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  BulkDeleteButton,
  BulkUpdateButton,
} from "react-admin";
import { Fragment } from "react";

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const DomainList = () => (
  <List actions={<ListActions />}>
    <Datagrid bulkActionButtons={<BulkActionButtons />} rowClick="show">
      <TextField source="domain" />
      <TextField source="alias" />
      <BooleanField source="enabled" />
      <TextField source="comment" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const BulkActionButtons = () => (
  <Fragment>
    <BulkDeleteButton />
    <BulkUpdateButton label="enable" data={{ enabled: true }} />
    <BulkUpdateButton label="disable" data={{ enabled: false }} />
  </Fragment>
);
