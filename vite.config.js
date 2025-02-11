import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Resolve environment variables (system > .env)
  const BASE_URL = process.env.VITE_BASE_URL || env.VITE_BASE_URL || "https://entrustv2api.neuralit.com";
  const BASE_PORT = process.env.VITE_BASE_PORT || env.VITE_BASE_PORT || "";
  const FRONTEND_URL = process.env.VITE_BASE_FRONTEND_URL || env.VITE_BASE_FRONTEND_URL || "https://entrustv2.neuralit.com";
  const RECAPTCHA_KEY = process.env.VITE_RECAPTCHA_KEY || env.VITE_RECAPTCHA_KEY || "6Lc8rkYqAAAAALLGmMUYKn0tFrrOcGhGqZWZIjoJ";
  const STRIPE_SECRET_KEY = process.env.VITE_STRIPE_SECRET_KEY || env.VITE_STRIPE_SECRET_KEY || "sk_test_V00g1w39I9d9z2C1Q8RThln";
  const CLIENT_SPECIFIC_ROLES = process.env.VITE_CLIENT_SPECIFIC_ROLES || env.VITE_CLIENT_SPECIFIC_ROLES || "[7]";
  const SECRET_KEY = process.env.VITE_SECRET_KEY || env.VITE_SECRET_KEY || "FOPS_SYNCENTRUST";

  console.log("Resolved Environment Variables:", {
    BASE_URL,
    BASE_PORT,
    FRONTEND_URL,
    RECAPTCHA_KEY,
    STRIPE_SECRET_KEY,
    CLIENT_SPECIFIC_ROLES,
    SECRET_KEY,
  });
  

  return {
    plugins: [react()],
    base: '/', // Use absolute paths for production
    build: {
      chunkSizeWarningLimit: 2000, // Avoid warnings for large chunks
      outDir: 'dist', // Default output directory
    },
    server: {
      host: '0.0.0.0', // Expose dev server to the network
      port: Number(env.VITE_PORT) || 3000,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000, // File watch adjustments
      },
    },
    define: {
      // Pass resolved environment variables to the frontend
      'process.env': {
        VITE_BASE_URL: BASE_URL,
        VITE_BASE_PORT: BASE_PORT,
        VITE_BASE_FRONTEND_URL: FRONTEND_URL,
        VITE_RECAPTCHA_KEY: RECAPTCHA_KEY,
        VITE_STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,
        VITE_CLIENT_SPECIFIC_ROLES: CLIENT_SPECIFIC_ROLES,
        VITE_SECRET_KEY: SECRET_KEY,
      },
    },
  };
});
