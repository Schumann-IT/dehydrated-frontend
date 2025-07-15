import { CheckCircle, Error, Warning } from "@mui/icons-material";
import React from "react";

// Define types for status objects
interface CertificateStatus {
  status:
    | "valid"
    | "expired"
    | "expiring_soon"
    | "not_yet_valid"
    | "unknown"
    | "error";
  icon: React.ReactElement;
  color: "success" | "error" | "warning" | "default";
  message?: string;
}

interface OpenSSLStatus extends CertificateStatus {
  type: "cert" | "chain" | "fullchain";
}

interface NetScalerStatus extends CertificateStatus {
  environment: string;
}

// Helper function to check certificate validity
export const checkCertificateValidity = (
  notBefore: string,
  notAfter: string,
): Omit<CertificateStatus, "message"> => {
  try {
    const now = new Date();
    const beforeDate = new Date(notBefore);
    const afterDate = new Date(notAfter);

    if (now < beforeDate) {
      return {
        status: "not_yet_valid" as const,
        icon: React.createElement(Warning, { color: "warning" }),
        color: "warning" as const,
      };
    } else if (now > afterDate) {
      return {
        status: "expired" as const,
        icon: React.createElement(Error, { color: "error" }),
        color: "error" as const,
      };
    } else {
      // Check if certificate expires within 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      if (now <= afterDate && afterDate <= thirtyDaysFromNow) {
        return {
          status: "expiring_soon" as const,
          icon: React.createElement(Warning, { color: "warning" }),
          color: "warning" as const,
        };
      } else {
        return {
          status: "valid" as const,
          icon: React.createElement(CheckCircle, { color: "success" }),
          color: "success" as const,
        };
      }
    }
  } catch {
    return {
      status: "unknown" as const,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    };
  }
};

// Helper function to get status color (for backward compatibility)
export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "valid":
      return "success";
    case "expired":
      return "error";
    case "warning":
      return "warning";
    default:
      return "default";
  }
};

// Helper function to format date strings
export const formatDate = (dateString: string) => {
  try {
    // Handle different date formats
    if (dateString.includes("GMT")) {
      // NetScaler format: "Sep 16 11:25:11 2025 GMT"
      return new Date(dateString).toLocaleString();
    } else if (dateString.includes("T")) {
      // ISO format: "2025-09-16T11:25:11Z"
      return new Date(dateString).toLocaleString();
    }
    return dateString;
  } catch {
    return dateString;
  }
};

// Define types for metadata objects
interface OpenSSLMetadata {
  cert?: {
    error?: string;
    not_before?: string;
    not_after?: string;
  };
  chain?: {
    error?: string;
    not_before?: string;
    not_after?: string;
  };
  fullchain?: {
    error?: string;
    not_before?: string;
    not_after?: string;
  };
}

interface NetScalerEnvironment {
  error?: string;
  clientcertnotbefore?: string;
  clientcertnotafter?: string;
}

interface NetScalerMetadata {
  error?: string;
  [environment: string]: NetScalerEnvironment | string | undefined;
}

interface MetadataWithOpenSSL {
  openssl?: OpenSSLMetadata;
}

interface MetadataWithNetScaler {
  netscaler?: NetScalerMetadata;
}

// Helper function to get OpenSSL certificate status
export const getOpenSSLStatus = (
  metadata: object | undefined,
): OpenSSLStatus[] | null => {
  if (!metadata || typeof metadata !== "object" || !("openssl" in metadata))
    return null;

  const openssl = (metadata as MetadataWithOpenSSL).openssl;
  if (!openssl) return null;

  const statuses: OpenSSLStatus[] = [];

  // Check certificate
  if (openssl.cert?.error) {
    statuses.push({
      type: "cert" as const,
      status: "error" as const,
      message: openssl.cert.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.cert?.not_before && openssl.cert?.not_after) {
    const validity = checkCertificateValidity(
      openssl.cert.not_before,
      openssl.cert.not_after,
    );
    statuses.push({ type: "cert" as const, ...validity });
  }

  // Check chain
  if (openssl.chain?.error) {
    statuses.push({
      type: "chain" as const,
      status: "error" as const,
      message: openssl.chain.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.chain?.not_before && openssl.chain?.not_after) {
    const validity = checkCertificateValidity(
      openssl.chain.not_before,
      openssl.chain.not_after,
    );
    statuses.push({ type: "chain" as const, ...validity });
  }

  // Check fullchain
  if (openssl.fullchain?.error) {
    statuses.push({
      type: "fullchain" as const,
      status: "error" as const,
      message: openssl.fullchain.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.fullchain?.not_before && openssl.fullchain?.not_after) {
    const validity = checkCertificateValidity(
      openssl.fullchain.not_before,
      openssl.fullchain.not_after,
    );
    statuses.push({ type: "fullchain" as const, ...validity });
  }

  return statuses;
};

// Helper function to get NetScaler certificate status
export const getNetScalerStatus = (
  metadata: object | undefined,
): NetScalerStatus[] | null => {
  if (!metadata || typeof metadata !== "object" || !("netscaler" in metadata))
    return null;

  const netscaler = (metadata as MetadataWithNetScaler).netscaler;
  if (!netscaler) return null;

  const statuses: NetScalerStatus[] = [];

  // Check if netscaler has a top-level error
  if (netscaler.error) {
    statuses.push({
      environment: "netscaler",
      status: "error" as const,
      message: netscaler.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
    return statuses;
  }

  // Check all environments dynamically
  Object.entries(netscaler).forEach(([environment, envData]) => {
    // Skip the error field as it's handled above
    if (environment === "error") return;

    // Skip if envData is not an object
    if (typeof envData !== "object" || envData === null) return;

    const environmentData = envData as NetScalerEnvironment;

    if (environmentData.error) {
      statuses.push({
        environment,
        status: "error" as const,
        message: environmentData.error,
        icon: React.createElement(Error, { color: "error" }),
        color: "error" as const,
      });
    } else if (
      environmentData.clientcertnotbefore &&
      environmentData.clientcertnotafter
    ) {
      const validity = checkCertificateValidity(
        environmentData.clientcertnotbefore,
        environmentData.clientcertnotafter,
      );
      statuses.push({ environment, ...validity });
    }
  });

  return statuses;
};
