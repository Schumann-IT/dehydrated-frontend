import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  FunctionField,
} from "react-admin";
import {
  ListItem,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, Security, Storage } from "@mui/icons-material";
import {
  formatDate,
  getStatusColor,
  checkCertificateValidity,
} from "../utils/certificateUtils";

// Define types for certificate data
interface NetScalerCertificateData {
  error?: string;
  cert?: string;
  key?: string;
  linkcertkeyname?: string;
  serial?: string;
  version?: string;
  clientcertnotbefore?: string;
  clientcertnotafter?: string;
  daystoexpiration?: number;
  status?: string;
  certificatetype?: string[];
  subject?: string;
  issuer?: string;
  publickey?: string;
  publickeysize?: number;
  signaturealg?: string;
  sandns?: string;
  expirymonitor?: string;
  notificationperiod?: number;
  feature?: string;
  inform?: string;
}

interface OpenSSLCertificateSection {
  error?: string;
  file?: string;
  subject?: string;
  dns_names?: string[];
  issuer?: string;
  not_before?: string;
  not_after?: string;
  type?: string;
  size?: number;
  [key: string]: string | string[] | number | undefined;
}

interface OpenSSLCertificateData {
  error?: string;
  cert?: OpenSSLCertificateSection;
  chain?: OpenSSLCertificateSection;
  fullchain?: OpenSSLCertificateSection;
  key?: OpenSSLCertificateSection;
}

// Component to display NetScaler certificate info
const NetScalerCertificateInfo = ({
  data,
  environment,
}: {
  data: NetScalerCertificateData;
  environment: string;
}) => {
  // Check if this is an error response
  if (data.error) {
    return (
      <Card variant="outlined" sx={{ mb: 2, borderColor: "error.main" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            {environment.toUpperCase()} Environment - Error
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Chip label="Error" color="error" size="small" />
            <Typography variant="body2" color="error">
              {data.error}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {environment.toUpperCase()} Environment
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Certificate Details
            </Typography>
            <Typography variant="body2">Cert: {data.cert}</Typography>
            <Typography variant="body2">Key: {data.key}</Typography>
            <Typography variant="body2">
              Link Cert Key: {data.linkcertkeyname}
            </Typography>
            <Typography variant="body2">Serial: {data.serial}</Typography>
            <Typography variant="body2">Version: {data.version}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Validity
            </Typography>
            <Typography variant="body2">
              Not Before: {formatDate(data.clientcertnotbefore || "")}
            </Typography>
            <Typography variant="body2">
              Not After: {formatDate(data.clientcertnotafter || "")}
            </Typography>
            <Typography variant="body2">
              Days to Expiration: {data.daystoexpiration}
            </Typography>
            <Chip
              label={data.status}
              color={
                getStatusColor(data.status || "") as
                  | "success"
                  | "error"
                  | "warning"
                  | "default"
              }
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <Typography variant="subtitle2" color="textSecondary">
              Certificate Types
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {data.certificatetype?.map((type: string) => (
                <Chip key={type} label={type} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Subject & Issuer
            </Typography>
            <Typography variant="body2">Subject: {data.subject}</Typography>
            <Typography variant="body2">Issuer: {data.issuer}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Technical Details
            </Typography>
            <Typography variant="body2">
              Public Key: {data.publickey}
            </Typography>
            <Typography variant="body2">
              Key Size: {data.publickeysize} bits
            </Typography>
            <Typography variant="body2">
              Signature Algorithm: {data.signaturealg}
            </Typography>
            <Typography variant="body2">SAN DNS: {data.sandns}</Typography>
          </Box>
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <Typography variant="subtitle2" color="textSecondary">
              Configuration
            </Typography>
            <Typography variant="body2">
              Expiry Monitor: {data.expirymonitor}
            </Typography>
            <Typography variant="body2">
              Notification Period: {data.notificationperiod} days
            </Typography>
            <Typography variant="body2">Feature: {data.feature}</Typography>
            <Typography variant="body2">Inform: {data.inform}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Component to display OpenSSL certificate info
const OpenSSLCertificateInfo = ({ data }: { data: OpenSSLCertificateData }) => {
  // Check if this is an error response
  if (data.error) {
    return (
      <Card variant="outlined" sx={{ mb: 2, borderColor: "error.main" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            OpenSSL Configuration - Error
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Chip label="Error" color="error" size="small" />
            <Typography variant="body2" color="error">
              {data.error}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Helper function to render certificate section with error handling
  const renderCertificateSection = (
    sectionName: string,
    sectionData: OpenSSLCertificateSection | undefined,
    fields: string[],
  ) => {
    if (sectionData?.error) {
      return (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {sectionName}
            </Typography>
            <Chip label="Error" color="error" size="small" />
          </Box>
          <Typography variant="body2" color="error">
            {sectionData.error}
          </Typography>
        </Box>
      );
    }

    // Check certificate validity for sections that have date fields
    const hasDateFields =
      fields.includes("not_before") && fields.includes("not_after");
    const validityInfo =
      hasDateFields && sectionData?.not_before && sectionData?.not_after
        ? checkCertificateValidity(
            sectionData.not_before,
            sectionData.not_after,
          )
        : null;

    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle2" color="textSecondary">
            {sectionName}
          </Typography>
          {validityInfo && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {validityInfo.icon}
              <Chip
                label={validityInfo.status.replace("_", " ")}
                color={validityInfo.color}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
        {fields.map((field) => {
          if (field === "not_before" || field === "not_after") {
            return (
              <Typography key={field} variant="body2">
                {field === "not_before" ? "Not Before: " : "Not After: "}
                {formatDate(sectionData?.[field] as string)}
              </Typography>
            );
          }

          const value = sectionData?.[field];
          if (Array.isArray(value)) {
            return (
              <Box key={field}>
                <Typography variant="body2" component="span">
                  {field === "dns_names"
                    ? "DNS Names"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                  :{" "}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}
                >
                  {value.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            );
          }

          return (
            <Typography key={field} variant="body2">
              {field === "dns_names"
                ? "DNS Names"
                : field.charAt(0).toUpperCase() + field.slice(1)}
              : {value}
            </Typography>
          );
        })}
      </Box>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          OpenSSL Certificate Information
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {renderCertificateSection("Certificate", data.cert, [
            "file",
            "subject",
            "dns_names",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Chain Certificate", data.chain, [
            "file",
            "subject",
            "dns_names",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Full Chain", data.fullchain, [
            "file",
            "subject",
            "dns_names",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Private Key", data.key, [
            "file",
            "type",
            "size",
          ])}
        </Box>
      </CardContent>
    </Card>
  );
};

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
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Domain Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Domain
              </Typography>
              <TextField source="domain" label="" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Alias
              </Typography>
              <TextField source="alias" label="" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Enabled
              </Typography>
              <BooleanField source="enabled" label="" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Comment
              </Typography>
              <TextField source="comment" label="" />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Alternative Names
              </Typography>
              <FunctionField
                source="alternativeNames"
                label=""
                render={(record) =>
                  record.alternativeNames &&
                  record.alternativeNames.length > 0 ? (
                    record.alternativeNames.map((name: string) => (
                      <ListItem key={name}>{name}</ListItem>
                    ))
                  ) : (
                    <span style={{ color: "#999" }}>No alternative names</span>
                  )
                }
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <FunctionField
        source="metadata"
        label=""
        render={(record) => {
          if (!record.metadata || Object.keys(record.metadata).length === 0) {
            return <span style={{ color: "#999" }}>No metadata available</span>;
          }

          return (
            <Box sx={{ mt: 2 }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Security color="primary" />
                    <Typography variant="h6">
                      Certificate Information
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {record.metadata.netscaler && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Storage color="secondary" />
                        NetScaler Configuration
                      </Typography>
                      {/* Check if netscaler has an error at the top level */}
                      {record.metadata.netscaler.error ? (
                        <NetScalerCertificateInfo
                          data={record.metadata.netscaler}
                          environment="netscaler"
                        />
                      ) : (
                        <>
                          {Object.entries(record.metadata.netscaler).map(
                            ([environment, envData]) => {
                              // Skip the error field as it's handled above
                              if (environment === "error") return null;

                              // Skip if envData is not an object
                              if (
                                typeof envData !== "object" ||
                                envData === null
                              )
                                return null;

                              return (
                                <NetScalerCertificateInfo
                                  key={environment}
                                  data={envData as NetScalerCertificateData}
                                  environment={environment}
                                />
                              );
                            },
                          )}
                        </>
                      )}
                    </Box>
                  )}

                  {record.metadata.openssl && (
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Security color="primary" />
                        OpenSSL Configuration
                      </Typography>
                      <OpenSSLCertificateInfo data={record.metadata.openssl} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          );
        }}
      />
    </SimpleShowLayout>
  </Show>
);
