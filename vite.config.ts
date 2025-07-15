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
    chunkSizeWarningLimit: 2000, // Increase warning limit to 2MB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            // Group all vendor libraries into a single vendor chunk
            return 'vendor';
          }
        },
        // Optimize chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Enable minification and tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
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
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-admin',
      'ra-core',
      'ra-ui-materialui',
      '@azure/msal-browser',
      '@azure/msal-react',
      '@mui/material',
      '@mui/icons-material',
    ],
  },
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
