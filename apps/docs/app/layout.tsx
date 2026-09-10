import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import { themeClassScript } from "~/lib/theme-class-script";
import { ThemeClassSync } from "~/lib/theme-class-sync";
import "./global.css";

// Same font-loading setup as .storybook/wrapper.tsx, exposed as the
// `--font-inter` CSS variable that styles/theme.css already expects.
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
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
