#!/usr/bin/env node
/**
 * Static-export build wrapper (used by .github/workflows/deploy-docs.yml
 * and `pnpm run docs:build:static`).
 *
 * Why this exists instead of a plain `next build`: on this Next version
 * (16.3.x), Turbopack's webpack-loader/postcss worker-pool child
 * processes are not terminated when the build finishes, so the
 * `next build` process never exits on its own -- it hangs forever after
 * printing the route summary, which would hang CI. This wrapper watches
 * for the summary, verifies the export is actually complete on disk,
 * and then terminates the build process itself (whose SIGTERM handler
 * exits cleanly). Revisit when Next is upgraded -- if a plain
 * `next build` exits by itself again, this file can be deleted.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(docsDir, "out");
// Files that only exist once the export has fully written: the home
// page, the 404 page, and the static search index.
const completionMarkers = ["index.html", "404.html", path.join("api", "search")];

/** How long the summary must have been visible before we conclude the build is only lingering, not still writing. */
const GRACE_MS = 20_000;
/** Hard ceiling on the whole build. */
const TIMEOUT_MS = 30 * 60_000;

const child = spawn("pnpm", ["exec", "next", "build"], {
    cwd: docsDir,
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env, DOCS_STATIC_EXPORT: "1" },
});

let summarySeenAt = null;
child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    if (summarySeenAt === null && String(chunk).includes("(Static)")) summarySeenAt = Date.now();
});

let terminatedByUs = false;
child.on("exit", (code, signal) => {
    if (terminatedByUs) {
        const complete = completionMarkers.every((m) => existsSync(path.join(outDir, m)));
        if (complete) {
            console.log("[build-static] Export complete; lingering build process terminated.");
            process.exit(0);
        }
        console.error("[build-static] Build process terminated but the export in out/ is incomplete.");
        process.exit(1);
    }
    // The build exited on its own (fixed Next version, or a real failure).
    process.exit(code ?? (signal ? 1 : 0));
});

const startedAt = Date.now();
const timer = setInterval(() => {
    if (Date.now() - startedAt > TIMEOUT_MS) {
        console.error(`[build-static] Build exceeded ${TIMEOUT_MS / 60000} minutes; killing.`);
        clearInterval(timer);
        terminatedByUs = false; // count as failure
        child.kill("SIGKILL");
        setTimeout(() => process.exit(1), 2_000);
        return;
    }
    if (summarySeenAt === null || Date.now() - summarySeenAt < GRACE_MS) return;
    if (!completionMarkers.every((m) => existsSync(path.join(outDir, m)))) return;
    clearInterval(timer);
    terminatedByUs = true;
    child.kill("SIGTERM");
    // Escalate if the SIGTERM handler itself is stuck.
    setTimeout(() => child.kill("SIGKILL"), 10_000).unref();
}, 2_000);
