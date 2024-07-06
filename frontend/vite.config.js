import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Consolidate configuration into a single export
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // Adjust the chunk size warning limit
  },
});
