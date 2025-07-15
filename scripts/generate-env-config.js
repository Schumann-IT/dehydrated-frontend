#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env files
// This will load .env, .env.local, .env.development, etc.
const envFiles = [
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", ".env.local"),
  path.join(__dirname, "..", ".env.development"),
];

console.log("🔍 Loading environment variables from .env files...");
envFiles.forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    const result = dotenv.config({ path: envFile });
    if (result.parsed) {
      console.log(
        `✅ Loaded ${Object.keys(result.parsed).length} variables from ${path.basename(envFile)}`,
      );
    }
  } else {
    console.log(`⚠️  ${path.basename(envFile)} not found`);
  }
});

// Read environment variables with fallbacks
const envVars = {
  VITE_APP_BASE_URI: process.env.VITE_APP_BASE_URI || "http://localhost:4173",
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:3000",
  VITE_ENABLE_MSAL: process.env.VITE_ENABLE_MSAL || "false",
  VITE_THEME_NAME: process.env.VITE_THEME_NAME || "hansemerkur",
  VITE_THEME_MODE: process.env.VITE_THEME_MODE || "light",
  VITE_MSAL_CLIENT_ID: process.env.VITE_MSAL_CLIENT_ID || "",
  VITE_MSAL_AUTHORITY: process.env.VITE_MSAL_AUTHORITY || "",
  VITE_DEHYDRATED_API_IDENTIFIER:
    process.env.VITE_DEHYDRATED_API_IDENTIFIER || "",
};

// Show which variables were loaded from environment vs defaults
console.log("\n📋 Environment variables:");
Object.entries(envVars).forEach(([key, value]) => {
  const source = process.env[key] ? "ENV" : "DEFAULT";
  console.log(`  ${key}: ${value} (${source})`);
});

// Generate the env-config.js content
const envConfigContent = `window.ENV_CONFIG = {
    VITE_APP_BASE_URI: "${envVars.VITE_APP_BASE_URI}",
    VITE_API_BASE_URL: "${envVars.VITE_API_BASE_URL}",
    VITE_ENABLE_MSAL: "${envVars.VITE_ENABLE_MSAL}",
    VITE_THEME_NAME: "${envVars.VITE_THEME_NAME}",
    VITE_THEME_MODE: "${envVars.VITE_THEME_MODE}",
    VITE_MSAL_CLIENT_ID: "${envVars.VITE_MSAL_CLIENT_ID}",
    VITE_MSAL_AUTHORITY: "${envVars.VITE_MSAL_AUTHORITY}",
    VITE_DEHYDRATED_API_IDENTIFIER: "${envVars.VITE_DEHYDRATED_API_IDENTIFIER}"
};`;

// Write to dist/env-config.js for serve mode
const distDir = path.join(__dirname, "..", "dist");
const distEnvConfigPath = path.join(distDir, "env-config.js");

try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(distEnvConfigPath, envConfigContent);
  console.log("\n✅ Generated env-config.js in dist directory for serve mode");
} catch (error) {
  console.error(
    "❌ Failed to generate env-config.js in dist directory:",
    error,
  );
  process.exit(1);
}
