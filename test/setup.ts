import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll } from "vitest";
import React from "react";

// Mock environment variables
vi.mock("import.meta.env", () => ({
  VITE_ENABLE_MSAL: "false",
  VITE_THEME_MODE: "light",
  VITE_THEME_NAME: "default",
  VITE_API_BASE_URL: "http://localhost:8080",
  VITE_APP_TITLE: "Dehydrated Frontend",
}));

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
  
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") || args[0].includes("Deprecation"))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Mock React Admin components that might cause issues in tests
vi.mock("react-admin", async () => {
  const actual = await vi.importActual("react-admin");
  return {
    ...actual,
    Admin: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
    Resource: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
    List: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
    Datagrid: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
    TextField: ({ source }: { source: string }) =>
      React.createElement("span", {}, source),
    BooleanField: ({ source }: { source: string }) =>
      React.createElement("span", {}, source),
    EditButton: ({ to }: { to: string }) =>
      React.createElement("button", {}, `Edit ${to}`),
    DeleteButton: ({ to }: { to: string }) =>
      React.createElement("button", {}, `Delete ${to}`),
    CreateButton: () => React.createElement("button", {}, "Create"),
    ExportButton: () => React.createElement("button", {}, "Export"),
    BulkDeleteButton: () => React.createElement("button", {}, "Bulk Delete"),
    BulkUpdateButton: ({ label }: { label: string }) =>
      React.createElement("button", {}, `Bulk ${label}`),
    SearchInput: () =>
      React.createElement("input", { placeholder: "Search..." }),
    useListContext: () => ({ data: [] }),
  };
});

// Mock MSAL
vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({
    instance: null,
    accounts: [],
    inProgress: "none",
  }),
  AuthenticatedTemplate: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", {}, children),
  UnauthenticatedTemplate: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", {}, children),
}));

// Mock Material-UI theme
vi.mock("@/theme", () => ({
  getTheme: vi.fn().mockResolvedValue({
    light: {},
    dark: {},
  }),
}));

// Note: @/resources/domains is mocked in individual test files when needed
// to avoid conflicts with specific test requirements

// Test utilities are available at test/test-utils.tsx
// Import them in your test files like:
// import { render, createMockDomain } from '../../test/test-utils';
