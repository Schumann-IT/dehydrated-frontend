import {
  Datagrid,
  TextField,
  BooleanField,
  FunctionField,
  RaRecord,
} from "react-admin";
import { useEffect, useState } from "react";
import { Box, Chip, Typography, CircularProgress } from "@mui/material";
import {
  getOpenSSLStatus,
  getNetScalerStatus,
} from "../utils/certificateUtils";
import { ModelDomainEntry } from "../data-provider/client/models";
import { dataProvider } from "@/dataProvider";

// Helper function to check if a domain has any invalid certificates
const isDomainInvalid = (record: ModelDomainEntry): boolean => {
  const opensslStatus = getOpenSSLStatus(record.metadata);
  const netscalerStatus = getNetScalerStatus(record.metadata);

  // Check OpenSSL status
  if (opensslStatus) {
    for (const status of opensslStatus) {
      if (status.status === "error" || status.status === "expired") {
        return true;
      }
    }
  }

  // Check NetScaler status
  if (netscalerStatus) {
    for (const status of netscalerStatus) {
      if (status.status === "error" || status.status === "expired") {
        return true;
      }
    }
  }

  return false;
};

// Custom hook to fetch all domains (iterate over pages)
const useAllDomains = () => {
  const [domains, setDomains] = useState<ModelDomainEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      let all: ModelDomainEntry[] = [];
      let page = 1;
      const perPage = 100;
      let total = 0;
      try {
        do {
          const result = await dataProvider().getList("domains", {
            pagination: { page, perPage },
            sort: { field: "domain", order: "ASC" },
            filter: {},
          });
          all = all.concat(result.data as ModelDomainEntry[]);
          total = typeof result.total === "number" ? result.total : 0;
          page++;
        } while (all.length < total);
        if (isMounted) setDomains(all);
      } catch (e: unknown) {
        if (isMounted)
          setError(e instanceof Error ? e.message : "Failed to load domains");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  return { domains, loading, error };
};

export const InvalidDomainList = () => {
  const { domains, loading, error } = useAllDomains();

  const handleRowClick = (
    _id: string | number,
    _resource: string,
    record: RaRecord,
  ) => {
    // Return the path to the domains resource show page instead of invalid-domains
    const domain = (record as ModelDomainEntry).domain || "";
    return `/admin/domains/${encodeURIComponent(domain)}/show`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ color: "error.main", textAlign: "center", mt: 4 }}>
        {error}
      </Box>
    );
  }
  if (!domains || domains.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No domains found
        </Typography>
      </Box>
    );
  }

  // Filter and group data by domain, but only include invalid domains
  const groupedData =
    domains.reduce(
      (acc: Record<string, ModelDomainEntry[]>, record: ModelDomainEntry) => {
        if (!isDomainInvalid(record)) {
          return acc;
        }
        const domain = record.domain || "Unknown";
        if (!acc[domain]) {
          acc[domain] = [];
        }
        acc[domain].push(record);
        return acc;
      },
      {},
    ) || {};

  if (Object.keys(groupedData).length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No invalid domains found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All domains have valid certificates
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Invalid Domains
      </Typography>
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "#fff3e0",
          borderRadius: 1,
          border: "1px solid #ffb74d",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Found <strong>{Object.keys(groupedData).length}</strong> invalid
          domain{Object.keys(groupedData).length !== 1 ? "s" : ""}
        </Typography>
      </Box>
      {Object.entries(groupedData).map(([domain, records]) => (
        <div key={domain} style={{ marginBottom: "20px" }}>
          <h3
            style={{
              padding: "10px",
              backgroundColor: "#ffebee",
              margin: 0,
              color: "#c62828",
              borderLeft: "4px solid #f44336",
            }}
          >
            Domain: {domain}
          </h3>
          <Datagrid
            data={records}
            bulkActionButtons={false}
            rowClick={handleRowClick}
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
          </Datagrid>
        </div>
      ))}
    </Box>
  );
};
