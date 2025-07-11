import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    sourcemap: mode === "development",
  },
  // This allows to have sourcemaps in production. They are not loaded unless you open the devtools
  // Remove this line if you don't need to debug react-admin in production
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@schumann-it/theme": path.resolve(__dirname, "../dehydrated-frontend-theme"),
      ...getAliasesToDebugInProduction(),
    },
  },
  base: "./",
}));

function getAliasesToDebugInProduction() {
  return [
    {
      find: "react-admin",
      replacement: path.resolve(__dirname, "./node_modules/react-admin/src"),
    },
    {
      find: "ra-core",
      replacement: path.resolve(__dirname, "./node_modules/ra-core/src"),
    },
    {
      find: "ra-ui-materialui",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-ui-materialui/src",
      ),
    },
    {
      find: "ra-i18n-polyglot",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-i18n-polyglot/src",
      ),
    },
    {
      find: "ra-language-english",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-language-english/src",
      ),
    },
    // add any other react-admin packages you have
  ];
}
