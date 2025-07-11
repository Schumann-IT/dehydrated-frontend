import { CheckCircle, Error, Warning } from "@mui/icons-material";
import React from "react";

// Helper function to check certificate validity
export const checkCertificateValidity = (
  notBefore: string,
  notAfter: string,
) => {
  try {
    const now = new Date();
    const beforeDate = new Date(notBefore);
    const afterDate = new Date(notAfter);

    if (now < beforeDate) {
      return {
        status: "not_yet_valid",
        icon: React.createElement(Warning, { color: "warning" }),
        color: "warning" as const,
      };
    } else if (now > afterDate) {
      return {
        status: "expired",
        icon: React.createElement(Error, { color: "error" }),
        color: "error" as const,
      };
    } else {
      // Check if certificate expires within 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      if (now <= afterDate && afterDate <= thirtyDaysFromNow) {
        return {
          status: "expiring_soon",
          icon: React.createElement(Warning, { color: "warning" }),
          color: "warning" as const,
        };
      } else {
        return {
          status: "valid",
          icon: React.createElement(CheckCircle, { color: "success" }),
          color: "success" as const,
        };
      }
    }
  } catch {
    return {
      status: "unknown",
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

// Helper function to get OpenSSL certificate status
export const getOpenSSLStatus = (metadata: any) => {
  if (!metadata?.openssl) return null;

  const openssl = metadata.openssl;
  const statuses = [];

  // Check certificate
  if (openssl.cert?.error) {
    statuses.push({
      type: "cert",
      status: "error",
      message: openssl.cert.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.cert?.not_before && openssl.cert?.not_after) {
    const validity = checkCertificateValidity(
      openssl.cert.not_before,
      openssl.cert.not_after,
    );
    statuses.push({ type: "cert", ...validity });
  }

  // Check chain
  if (openssl.chain?.error) {
    statuses.push({
      type: "chain",
      status: "error",
      message: openssl.chain.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.chain?.not_before && openssl.chain?.not_after) {
    const validity = checkCertificateValidity(
      openssl.chain.not_before,
      openssl.chain.not_after,
    );
    statuses.push({ type: "chain", ...validity });
  }

  // Check fullchain
  if (openssl.fullchain?.error) {
    statuses.push({
      type: "fullchain",
      status: "error",
      message: openssl.fullchain.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (openssl.fullchain?.not_before && openssl.fullchain?.not_after) {
    const validity = checkCertificateValidity(
      openssl.fullchain.not_before,
      openssl.fullchain.not_after,
    );
    statuses.push({ type: "fullchain", ...validity });
  }

  return statuses;
};

// Helper function to get NetScaler certificate status
export const getNetScalerStatus = (metadata: any) => {
  if (!metadata?.netscaler) return null;

  const netscaler = metadata.netscaler;
  const statuses = [];

  // Check if netscaler has a top-level error
  if (netscaler.error) {
    statuses.push({
      environment: "netscaler",
      status: "error",
      message: netscaler.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
    return statuses;
  }

  // Check dev environment
  if (netscaler.dev?.error) {
    statuses.push({
      environment: "dev",
      status: "error",
      message: netscaler.dev.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (
    netscaler.dev?.clientcertnotbefore &&
    netscaler.dev?.clientcertnotafter
  ) {
    const validity = checkCertificateValidity(
      netscaler.dev.clientcertnotbefore,
      netscaler.dev.clientcertnotafter,
    );
    statuses.push({ environment: "dev", ...validity });
  }

  // Check prod environment
  if (netscaler.prod?.error) {
    statuses.push({
      environment: "prod",
      status: "error",
      message: netscaler.prod.error,
      icon: React.createElement(Error, { color: "error" }),
      color: "error" as const,
    });
  } else if (
    netscaler.prod?.clientcertnotbefore &&
    netscaler.prod?.clientcertnotafter
  ) {
    const validity = checkCertificateValidity(
      netscaler.prod.clientcertnotbefore,
      netscaler.prod.clientcertnotafter,
    );
    statuses.push({ environment: "prod", ...validity });
  }

  return statuses;
};
