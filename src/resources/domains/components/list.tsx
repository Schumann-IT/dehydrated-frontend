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
  useListContext,
  FunctionField,
  SearchInput,
} from "react-admin";
import { Fragment } from "react";

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const GroupedDatagrid = () => {
  const { data } = useListContext();
  
  // Group data by domain, but use alias for identification when available
  const groupedData = data?.reduce((acc: Record<string, any[]>, record: any) => {
    const domain = record.domain || 'Unknown';
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(record);
    return acc;
  }, {}) || {};

  return (
    <>
      {Object.entries(groupedData).map(([domain, records]) => (
        <div key={domain} style={{ marginBottom: '20px' }}>
          <h3 style={{ padding: '10px', backgroundColor: '#f5f5f5', margin: 0 }}>
            Domain: {domain}
          </h3>
          <Datagrid 
            data={records}
            bulkActionButtons={<BulkActionButtons />} 
            rowClick="show"
          >
            <TextField source="domain" label="Domain" />
            <TextField source="alias" label="Alias" />
            <BooleanField source="enabled" label="Enabled" />
            <TextField source="comment" label="Comment" />
            <FunctionField
              label="Actions"
              render={(record: any) => {
                const basePath = "/admin/domains";
                const editUrl = record.alias 
                  ? `${basePath}/${encodeURIComponent(record.domain)}?alias=${encodeURIComponent(record.alias)}`
                  : `${basePath}/${encodeURIComponent(record.domain)}`;
                
                return (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <EditButton to={editUrl} label="Edit" />
                    <DeleteButton to={editUrl} label="Delete" />
                  </div>
                );
              }}
            />
          </Datagrid>
        </div>
      ))}
    </>
  );
};

export const DomainList = () => (
  <List 
    actions={<ListActions />}
    filters={[
      <SearchInput source="q" placeholder="Search domains, aliases, or comments..." alwaysOn />
    ]}
  >
    <GroupedDatagrid />
  </List>
);

export const BulkActionButtons = () => (
  <Fragment>
    <BulkDeleteButton />
    <BulkUpdateButton label="enable" data={{ enabled: true }} />
    <BulkUpdateButton label="disable" data={{ enabled: false }} />
  </Fragment>
);
