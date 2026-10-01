import React, { useEffect } from "react";
import localFont from "next/font/local";

// Self-hosted (OFL, latin subset) rather than next/font/google: a Google Fonts fetch at build/dev
// time stalls or fails where outbound requests from Node are blocked, and this keeps Storybook
// deterministic offline. Same files as apps/docs/app/fonts.
const inter = localFont({
    src: "./fonts/inter-latin-variable.woff2",
    weight: "100 900",
    display: "swap",
    variable: "--font-inter",
});

// Backs the `--font-handwritten` token (styles/theme.css) used only by
// FlowCanvas's "sketchy" edge style.
const kalam = localFont({
    src: [
        { path: "./fonts/kalam-latin-400.woff2", weight: "400" },
        { path: "./fonts/kalam-latin-700.woff2", weight: "700" },
    ],
    display: "swap",
    variable: "--font-kalam",
});

const Wrapper = (Story: any) => {
    // Expose the font variables on <html> too, so the body font and portalled overlays (menus,
    // modals, tooltips) resolve them, not just content inside the story wrapper below.
    useEffect(() => {
        document.documentElement.classList.add(inter.variable, kalam.variable);
    }, []);

    useEffect(() => {
        const handler = (event: SubmitEvent) => {
            event.stopPropagation();
            event.preventDefault();

            alert("Form submitted!");
        };

        window.addEventListener("submit", handler);

        return () => {
            window.removeEventListener("submit", handler);
        };
    }, []);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            // Traverse up the DOM tree to find if we clicked on or inside an <a> element
            let target = event.target as Element;

            while (target && target !== document.body) {
                if (target.tagName === "A") {
                    console.log("Link click prevented:", target.getAttribute("href"));
                    event.preventDefault();
                    return;
                }
                target = target.parentElement as Element;
            }
        };

        // Use capture phase to intercept clicks before React components handle them
        document.addEventListener("click", handler, true);

        return () => {
            document.removeEventListener("click", handler, true);
        };
    }, []);

    return (
        <div className={`${inter.variable} ${kalam.variable}`}>
            <Story />
        </div>
    );
};

export default Wrapper;
