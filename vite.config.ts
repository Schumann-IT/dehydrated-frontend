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
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'react-admin-vendor': ['react-admin', 'ra-core', 'ra-ui-materialui', 'ra-i18n-polyglot', 'ra-language-english'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'auth-vendor': ['@azure/msal-react', 'ra-auth-msal'],
          'router-vendor': ['react-router', 'react-router-dom'],
          'utils-vendor': ['react-markdown'],
          'data-vendor': ['ra-data-simple-rest'],
        },
        // Optimize chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  // This allows to have sourcemaps in production. They are not loaded unless you open the devtools
  // Remove this line if you don't need to debug react-admin in production
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
