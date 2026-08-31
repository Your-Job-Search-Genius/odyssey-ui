import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Type-only cast: plugin-react's vite peer can resolve to a newer vite major
  // than the one vitest bundles; the plugin runs fine on both.
  plugins: [react() as never],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    globals: true,
  },
});
