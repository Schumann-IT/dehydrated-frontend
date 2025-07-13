import { describe, it, expect } from "vitest";
import {
  checkCertificateValidity,
  getStatusColor,
  formatDate,
  getOpenSSLStatus,
  getNetScalerStatus,
} from "../certificateUtils";

describe("checkCertificateValidity", () => {
  it("should return valid status for current certificate", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 day ago
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 year from now

    const result = checkCertificateValidity(notBefore, notAfter);

    expect(result.status).toBe("valid");
    expect(result.color).toBe("success");
  });

  it("should return expired status for past certificate", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 365 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 year ago
    const notAfter = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 day ago

    const result = checkCertificateValidity(notBefore, notAfter);

    expect(result.status).toBe("expired");
    expect(result.color).toBe("error");
  });

  it("should return not_yet_valid status for future certificate", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 day from now
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 year from now

    const result = checkCertificateValidity(notBefore, notAfter);

    expect(result.status).toBe("not_yet_valid");
    expect(result.color).toBe("warning");
  });

  it("should return expiring_soon status for certificate expiring within 30 days", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 365 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 1 year ago
    const notAfter = new Date(
      now.getTime() + 15 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 15 days from now

    const result = checkCertificateValidity(notBefore, notAfter);

    expect(result.status).toBe("expiring_soon");
    expect(result.color).toBe("warning");
  });
});

describe("getStatusColor", () => {
  it("should return success for valid status", () => {
    expect(getStatusColor("valid")).toBe("success");
    expect(getStatusColor("VALID")).toBe("success");
  });

  it("should return error for expired status", () => {
    expect(getStatusColor("expired")).toBe("error");
    expect(getStatusColor("EXPIRED")).toBe("error");
  });

  it("should return warning for warning status", () => {
    expect(getStatusColor("warning")).toBe("warning");
    expect(getStatusColor("WARNING")).toBe("warning");
  });

  it("should return default for unknown status", () => {
    expect(getStatusColor("unknown")).toBe("default");
    expect(getStatusColor("")).toBe("default");
    expect(getStatusColor(undefined as unknown as string)).toBe("default");
  });
});

describe("formatDate", () => {
  it("should format NetScaler GMT date", () => {
    const netscalerDate = "Sep 16 11:25:11 2025 GMT";
    const result = formatDate(netscalerDate);

    // Should return a formatted date string
    expect(typeof result).toBe("string");
    expect(result).not.toBe(netscalerDate);
  });

  it("should format ISO date", () => {
    const isoDate = "2025-09-16T11:25:11Z";
    const result = formatDate(isoDate);

    // Should return a formatted date string
    expect(typeof result).toBe("string");
    expect(result).not.toBe(isoDate);
  });

  it("should return original string for invalid dates", () => {
    const invalidDate = "not-a-date";
    const result = formatDate(invalidDate);

    expect(result).toBe(invalidDate);
  });
});

describe("getOpenSSLStatus", () => {
  it("should return null for undefined metadata", () => {
    const result = getOpenSSLStatus(undefined);
    expect(result).toBeNull();
  });

  it("should return null for metadata without openssl property", () => {
    const metadata = { someOtherProperty: "value" };
    const result = getOpenSSLStatus(metadata);
    expect(result).toBeNull();
  });

  it("should return error status for certificate with error", () => {
    const metadata = {
      openssl: {
        cert: {
          error: "Certificate error message",
        },
      },
    };

    const result = getOpenSSLStatus(metadata);

    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      type: "cert",
      status: "error",
      message: "Certificate error message",
      color: "error",
    });
  });

  it("should return valid status for certificate with valid dates", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const metadata = {
      openssl: {
        cert: {
          not_before: notBefore,
          not_after: notAfter,
        },
      },
    };

    const result = getOpenSSLStatus(metadata);

    expect(result).toHaveLength(1);
    expect(result![0].type).toBe("cert");
    expect(result![0].status).toBe("valid");
    expect(result![0].color).toBe("success");
  });

  it("should handle multiple certificate types", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const metadata = {
      openssl: {
        cert: {
          not_before: notBefore,
          not_after: notAfter,
        },
        chain: {
          not_before: notBefore,
          not_after: notAfter,
        },
        fullchain: {
          not_before: notBefore,
          not_after: notAfter,
        },
      },
    };

    const result = getOpenSSLStatus(metadata);

    expect(result).toHaveLength(3);
    expect(result!.map((r) => r.type)).toEqual(["cert", "chain", "fullchain"]);
    expect(result!.every((r) => r.status === "valid")).toBe(true);
  });
});

describe("getNetScalerStatus", () => {
  it("should return null for undefined metadata", () => {
    const result = getNetScalerStatus(undefined);
    expect(result).toBeNull();
  });

  it("should return null for metadata without netscaler property", () => {
    const metadata = { someOtherProperty: "value" };
    const result = getNetScalerStatus(metadata);
    expect(result).toBeNull();
  });

  it("should return error status for netscaler with error", () => {
    const metadata = {
      netscaler: {
        error: "NetScaler error message",
      },
    };

    const result = getNetScalerStatus(metadata);

    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      environment: "netscaler",
      status: "error",
      message: "NetScaler error message",
      color: "error",
    });
  });

  it("should return valid status for dev environment with valid dates", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const metadata = {
      netscaler: {
        dev: {
          clientcertnotbefore: notBefore,
          clientcertnotafter: notAfter,
        },
      },
    };

    const result = getNetScalerStatus(metadata);

    expect(result).toHaveLength(1);
    expect(result![0].environment).toBe("dev");
    expect(result![0].status).toBe("valid");
    expect(result![0].color).toBe("success");
  });

  it("should handle both dev and prod environments", () => {
    const now = new Date();
    const notBefore = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const notAfter = new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const metadata = {
      netscaler: {
        dev: {
          clientcertnotbefore: notBefore,
          clientcertnotafter: notAfter,
        },
        prod: {
          clientcertnotbefore: notBefore,
          clientcertnotafter: notAfter,
        },
      },
    };

    const result = getNetScalerStatus(metadata);

    expect(result).toHaveLength(2);
    expect(result!.map((r) => r.environment)).toEqual(["dev", "prod"]);
    expect(result!.every((r) => r.status === "valid")).toBe(true);
  });
});
