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
  Grid,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { ExpandMore, Security, Storage } from "@mui/icons-material";
import {
  formatDate,
  getStatusColor,
  checkCertificateValidity,
} from "../utils/certificateUtils";

// Component to display NetScaler certificate info
const NetScalerCertificateInfo = ({
  data,
  environment,
}: {
  data: any;
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Validity
            </Typography>
            <Typography variant="body2">
              Not Before: {formatDate(data.clientcertnotbefore)}
            </Typography>
            <Typography variant="body2">
              Not After: {formatDate(data.clientcertnotafter)}
            </Typography>
            <Typography variant="body2">
              Days to Expiration: {data.daystoexpiration}
            </Typography>
            <Chip
              label={data.status}
              color={getStatusColor(data.status) as any}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Certificate Types
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {data.certificatetype?.map((type: string) => (
                <Chip key={type} label={type} size="small" variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Subject & Issuer
            </Typography>
            <Typography variant="body2">Subject: {data.subject}</Typography>
            <Typography variant="body2">Issuer: {data.issuer}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to display OpenSSL certificate info
const OpenSSLCertificateInfo = ({ data }: { data: any }) => {
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
    sectionData: any,
    fields: string[],
  ) => {
    if (sectionData?.error) {
      return (
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {sectionName}
            </Typography>
            <Chip label="Error" color="error" size="small" />
          </Box>
          <Typography variant="body2" color="error">
            {sectionData.error}
          </Typography>
        </Grid>
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
      <Grid item xs={12} md={6}>
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
                {formatDate(sectionData?.[field])}
              </Typography>
            );
          }
          return (
            <Typography key={field} variant="body2">
              {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
              {sectionData?.[field]}
            </Typography>
          );
        })}
      </Grid>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          OpenSSL Certificate Information
        </Typography>
        <Grid container spacing={2}>
          {renderCertificateSection("Certificate", data.cert, [
            "file",
            "subject",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Chain Certificate", data.chain, [
            "file",
            "subject",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Full Chain", data.fullchain, [
            "file",
            "subject",
            "issuer",
            "not_before",
            "not_after",
          ])}
          {renderCertificateSection("Private Key", data.key, [
            "file",
            "type",
            "size",
          ])}
        </Grid>
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Domain
              </Typography>
              <TextField source="domain" label="" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Alias
              </Typography>
              <TextField source="alias" label="" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Enabled
              </Typography>
              <BooleanField source="enabled" label="" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Comment
              </Typography>
              <TextField source="comment" label="" />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
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
                          {record.metadata.netscaler.dev && (
                            <NetScalerCertificateInfo
                              data={record.metadata.netscaler.dev}
                              environment="dev"
                            />
                          )}
                          {record.metadata.netscaler.prod && (
                            <NetScalerCertificateInfo
                              data={record.metadata.netscaler.prod}
                              environment="prod"
                            />
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
