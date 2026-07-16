import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Keep asset URLs relative-friendly and hashed
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    open: false,
    watch: {
      // Don't watch source-asset scratch folders (originals get processed into
      // public/assets/). Windows leaves ".~tmp" lock files when apps like
      // Photoshop save images, which chokes the FS watcher.
      ignored: [
        "**/assets/**",           // repo-root scratchpad, not the app's public/assets
        "**/_legacy-dist/**",     // pre-migration snapshot
        "**/dist/**",             // build output
        "**/*.~tmp",              // Windows temp-save lock files
        "**/*.tmp",
      ],
    },
  },
});
