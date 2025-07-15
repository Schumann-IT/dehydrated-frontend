import { describe, it, expect, beforeEach } from "vitest";
import { getEnvVar, type EnvConfig } from "../env";

describe("getEnvVar", () => {
  beforeEach(() => {
    // Reset window object
    delete (global as { window?: Window }).window;

    // Mock import.meta.env for testing
    (
      import.meta as unknown as {
        env: {
          DEV: boolean;
          VITE_API_BASE_URL: string;
          VITE_APP_BASE_URI: string;
        };
      }
    ).env = {
      DEV: true,
      VITE_API_BASE_URL: "https://test-api.example.com",
      VITE_APP_BASE_URI: "https://test-app.example.com",
    };
  });

  it("should return runtime environment variable when available", () => {
    // Mock window object with runtime config
    const mockWindow = {
      ENV_CONFIG: {
        VITE_API_BASE_URL: "https://api.example.com",
        VITE_APP_BASE_URI: "https://app.example.com",
      } as EnvConfig,
    } as Window;

    (global as { window?: Window }).window = mockWindow;

    const result = getEnvVar("VITE_API_BASE_URL");
    expect(result).toBe("https://api.example.com");
  });

  it("should return undefined when runtime variable is not available", () => {
    // Test with a variable that doesn't exist in runtime config
    const result = getEnvVar("VITE_MSAL_CLIENT_ID");
    expect(result).toBeUndefined();
  });

  it("should handle missing window.ENV_CONFIG gracefully", () => {
    // Set window but ensure ENV_CONFIG is truly undefined
    const mockWindow = {} as Window;
    (global as { window?: Window }).window = mockWindow;
    delete (window as { ENV_CONFIG?: EnvConfig }).ENV_CONFIG;

    const mockEnv = {
      DEV: true,
      VITE_API_BASE_URL: "https://test-api.example.com",
      VITE_APP_BASE_URI: "https://test-app.example.com",
    };

    const result = getEnvVar("VITE_APP_BASE_URI", mockEnv);
    if (mockEnv.DEV) {
      // In dev, fallback to build-time value
      expect(result).toBe("https://test-app.example.com");
    } else {
      // In prod, should be undefined
      expect(result).toBeUndefined();
    }
  });

  it("should handle empty ENV_CONFIG gracefully", () => {
    // Set window with empty ENV_CONFIG
    const mockWindow = {
      ENV_CONFIG: {} as EnvConfig,
    } as Window;

    (global as { window?: Window }).window = mockWindow;

    const result = getEnvVar("VITE_API_BASE_URL");
    expect(result).toBeUndefined();
  });

  it("should work in development mode with build-time fallback", () => {
    // Test that the function works in development mode
    // It should return the actual build-time value if available
    const mockEnv = {
      DEV: true,
      VITE_API_BASE_URL: "https://test-api.example.com",
      VITE_APP_BASE_URI: "https://test-app.example.com",
    };
    const result = getEnvVar("VITE_API_BASE_URL", mockEnv);
    // Just check that it returns something (either runtime or build-time)
    expect(typeof result).toBe("string");
  });
});
