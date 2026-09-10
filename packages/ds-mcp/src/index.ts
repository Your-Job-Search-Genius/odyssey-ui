/**
 * Public API for @your-job-search-genius/ds-mcp. Consumers that just
 * want the server (e.g. apps/docs's HTTP route) import from here or from
 * "./http.js" directly; the validator is also exported standalone (see
 * "./validator.js") for reuse outside an MCP context (an ESLint rule, a
 * CI check). The plain tool functions (getComponentEntry, searchIcons,
 * ...) are exported so apps/docs's playground agent loop can call the
 * exact same tool logic in-process, without round-tripping through MCP
 * -- see that package's lib/playground/tool-executor.ts.
 */
export { createServer, resolveRegistry, warnOnLibraryVersionMismatch, SERVER_NAME, SERVER_VERSION } from "./server.js";
export { handleMcpWebRequest, handleMcpNodeRequest } from "./http.js";
export { validateJsx } from "./validator.js";
export type { ValidateJsxOptions, ValidateJsxResult, ValidationIssue } from "./validator.js";
export { rulesToMarkdown, listComponents, getComponentEntry, searchComponents, getTokens, searchIcons, suggestComposition, getExample } from "./tools.js";
export type { ListComponentsInput, SearchComponentsResult, SearchIconsResult, SuggestCompositionResult } from "./tools.js";
export { createStaticRegistryHolder, createRefreshableRegistryHolder, startRegistryAutoRefresh, toRegistryHolder } from "./registry-holder.js";
export type { RegistryHolder, RefreshableRegistryHolder, AutoRefreshOptions } from "./registry-holder.js";
