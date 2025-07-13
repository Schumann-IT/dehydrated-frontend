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
import { Box, Chip, Typography } from "@mui/material";
import {
  getOpenSSLStatus,
  getNetScalerStatus,
} from "../utils/certificateUtils";
import { ModelDomainEntry } from "../data-provider/client/models";

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const GroupedDatagrid = () => {
  const { data } = useListContext();

  // Group data by domain, but use alias for identification when available
  const groupedData =
    (data as ModelDomainEntry[])?.reduce(
      (acc: Record<string, ModelDomainEntry[]>, record: ModelDomainEntry) => {
        const domain = record.domain || "Unknown";
        if (!acc[domain]) {
          acc[domain] = [];
        }
        acc[domain].push(record);
        return acc;
      },
      {},
    ) || {};

  return (
    <>
      {Object.entries(groupedData).map(([domain, records]) => (
        <div key={domain} style={{ marginBottom: "20px" }}>
          <h3
            style={{ padding: "10px", backgroundColor: "#f5f5f5", margin: 0 }}
          >
            Domain: {domain}
          </h3>
          <Datagrid
            data={records}
            bulkActionButtons={<BulkActionButtons />}
            rowClick="show"
          >
            <TextField source="domain" label="Domain" />
            <TextField source="alias" label="Alias" sortable={false} />
            <BooleanField source="enabled" label="Enabled" sortable={false} />
            <TextField source="comment" label="Comment" sortable={false} />
            <FunctionField
              label="OpenSSL Status"
              sortable={false}
              render={(record: ModelDomainEntry) => {
                const opensslStatus = getOpenSSLStatus(record.metadata);
                if (!opensslStatus || opensslStatus.length === 0) {
                  return <span style={{ color: "#999" }}>No data</span>;
                }

                return (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {opensslStatus.map((status, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {status.icon}
                        <Typography
                          variant="caption"
                          sx={{ textTransform: "uppercase" }}
                        >
                          {status.type}:
                        </Typography>
                        <Chip
                          label={status.status.replace("_", " ")}
                          color={status.color}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Box>
                );
              }}
            />
            <FunctionField
              label="NetScaler Status"
              sortable={false}
              render={(record: ModelDomainEntry) => {
                const netscalerStatus = getNetScalerStatus(record.metadata);
                if (!netscalerStatus || netscalerStatus.length === 0) {
                  return <span style={{ color: "#999" }}>No data</span>;
                }

                return (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {netscalerStatus.map((status, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {status.icon}
                        <Typography
                          variant="caption"
                          sx={{ textTransform: "uppercase" }}
                        >
                          {status.environment}:
                        </Typography>
                        <Chip
                          label={status.status.replace("_", " ")}
                          color={status.color}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Box>
                );
              }}
            />
            <FunctionField
              label="Actions"
              sortable={false}
              render={(record: ModelDomainEntry) => {
                const basePath = "/admin/domains";
                const domain = record.domain || "";
                const editUrl = record.alias
                  ? `${basePath}/${encodeURIComponent(domain)}?alias=${encodeURIComponent(record.alias)}`
                  : `${basePath}/${encodeURIComponent(domain)}`;

                return (
                  <div style={{ display: "flex", gap: "8px" }}>
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
      <SearchInput
        key="search"
        source="q"
        placeholder="Search domains..."
        alwaysOn
      />,
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
