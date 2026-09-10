import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        // Mirrors apps/docs/tsconfig.json's "@/*" path alias -- lets the
        // render test import real packages/ui components (which use "@/..."
        // internally, e.g. button.tsx's "@/utils/cx") directly, unmodified.
        alias: { "@": path.resolve(import.meta.dirname, "..", "ui") },
    },
    // packages/ui's own files live outside this package's root, so Vite
    // treats them as pre-bundled "dependencies" and transforms their JSX
    // with esbuild directly rather than through @vitejs/plugin-react's
    // babel pipeline -- esbuild's default jsx mode is the classic
    // React.createElement transform, which fails with "React is not
    // defined" on files (e.g. check.tsx, select.tsx) that never import
    // React because they were written for the automatic runtime. Forcing
    // esbuild's own jsx mode to "automatic" here fixes that regardless of
    // which pipeline actually processes a given file.
    esbuild: { jsx: "automatic" },
    test: {
        environment: "jsdom",
        include: ["__tests__/**/*.test.{ts,tsx}"],
        testTimeout: 30_000,
    },
});
