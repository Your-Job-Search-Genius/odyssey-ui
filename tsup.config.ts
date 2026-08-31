import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/fonts.ts", "src/components/*/index.ts", "src/components/*/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
});
