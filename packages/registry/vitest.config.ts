import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["__tests__/**/*.test.ts"],
        // The extractor spawns a full TypeScript program over packages/ui,
        // which is slow the first time a cold test run parses it.
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
});
