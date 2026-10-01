import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import localFont from "next/font/local";
import { themeClassScript } from "~/lib/theme-class-script";
import { ThemeClassSync } from "~/lib/theme-class-sync";
import "./global.css";

// Same font-loading setup as .storybook/wrapper.tsx, exposed as the
// `--font-inter` CSS variable that styles/theme.css already expects. Self-hosted (OFL, latin
// subset) instead of next/font/google so the build never depends on reaching Google Fonts.
const inter = localFont({
    src: "./fonts/inter-latin-variable.woff2",
    weight: "100 900",
    variable: "--font-inter",
});

// Backs the `--font-handwritten` token (styles/theme.css) used only by
// FlowCanvas's "sketchy" edge style. Same loading pattern as Inter above.
const kalam = localFont({
    src: [
        { path: "./fonts/kalam-latin-400.woff2", weight: "400" },
        { path: "./fonts/kalam-latin-700.woff2", weight: "700" },
    ],
    variable: "--font-kalam",
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${kalam.variable}`} suppressHydrationWarning>
            <head>
                {/* Sets .light-mode/.dark-mode on <html> before hydration so the
                    library's semantic color tokens (text-primary, bg-secondary, ...)
                    render correctly on first paint everywhere in the app, not just
                    inside <PreviewFrame>. See lib/theme-class-script.ts. */}
                <script dangerouslySetInnerHTML={{ __html: themeClassScript }} />
            </head>
            <body className="flex min-h-screen flex-col">
                {/* Static client-side search against the build-time index served
                    from /api/search (see app/api/search/route.ts). The api URL is
                    prefixed explicitly because GitHub Pages project sites serve
                    the app under a base path. */}
                <RootProvider search={{ options: { type: "static", api: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/search` } }}>
                    <ThemeClassSync />
                    {children}
                </RootProvider>
            </body>
        </html>
    );
}
