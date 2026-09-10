import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// GitHub Pages deployment (see .github/workflows/deploy-docs.yml): the
// workflow sets DOCS_STATIC_EXPORT=1 and DOCS_BASE_PATH=/<repo-name>,
// producing a fully static site in apps/docs/out. Server-only routes
// (app/api/mcp, app/api/playground, app/playground) are removed by the
// workflow before this build runs -- POST route handlers are not
// representable in a static export at all.
const isStaticExport = process.env.DOCS_STATIC_EXPORT === "1";
const basePath = process.env.DOCS_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    // The docs app lives in apps/docs but imports the real component
    // library source (components/, utils/, hooks/) from packages/ui, so
    // Next must be told to compile files outside its own project
    // directory.
    experimental: {
        externalDir: true,
    },
    // Exposed to the client so the static search dialog can fetch the
    // prebuilt /api/search index from under the base path (see
    // app/layout.tsx) -- a plain relative fetch would miss the prefix
    // on GitHub Pages project sites.
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
    ...(isStaticExport
        ? {
              output: "export",
              basePath,
              trailingSlash: true,
              images: { unoptimized: true },
              // In this Next version distDir IS the export output directory
              // (see node_modules/next/dist/docs/01-app/02-guides/static-exports.md)
              // -- "out" gives the classic layout the Pages workflow uploads,
              // and keeps export builds from trampling a running dev server's
              // .next dir.
              distDir: "out",
          }
        : {
              // redirects() is unsupported with output:"export"; static hosts
              // simply serve the docs tree directly.
              async redirects() {
                  return [
                      {
                          source: "/docs",
                          destination: "/docs/getting-started/introduction",
                          permanent: false,
                      },
                      {
                          source: "/docs/getting-started",
                          destination: "/docs/getting-started/introduction",
                          permanent: false,
                      },
                  ];
              },
          }),
};

export default withMDX(config);
