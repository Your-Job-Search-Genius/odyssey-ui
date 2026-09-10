import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        // Mirrors tsconfig.json's "~/*" path alias -- Next.js's own bundler
        // understands tsconfig paths automatically, but Vitest's Vite-based
        // resolver does not, so source files using "~/..." (e.g. evals/run.ts)
        // need this spelled out explicitly to run under vitest.
        alias: { "~": import.meta.dirname },
    },
    test: {
        environment: "node",
        include: ["__tests__/**/*.test.ts", "evals/**/__tests__/**/*.test.ts"],
        testTimeout: 30_000,
    },
});
