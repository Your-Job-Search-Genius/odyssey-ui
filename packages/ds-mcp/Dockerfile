# syntax=docker/dockerfile:1
# Standalone deployment image for the Writesea Odyssey MCP server
# (Streamable HTTP). Installs the published package from GitHub
# Packages, which requires auth even for reads -- pass your ~/.npmrc
# (scope + read:packages token, see README "Connecting from Claude and
# ChatGPT") as a BuildKit secret so the token never lands in a layer:
#
#   docker build --secret id=npmrc,src=$HOME/.npmrc -t writesea-ds-mcp packages/ds-mcp
#   docker run -p 3002:3002 writesea-ds-mcp
#
# The MCP endpoint is then http://localhost:3002/mcp (health: /healthz).
FROM node:22-alpine

WORKDIR /app

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm install --omit=dev @your-job-search-genius/ds-mcp

ENV PORT=3002 \
    NODE_ENV=production
EXPOSE 3002

# Optional: set DS_REGISTRY_URL (+ DS_REGISTRY_REFRESH_MS) at runtime to
# hot-reload a fresher registry than the one bundled at publish time.
CMD ["./node_modules/.bin/ds-mcp", "serve"]
