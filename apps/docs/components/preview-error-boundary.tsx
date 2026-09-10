"use client";

import { Component, type ReactNode } from "react";

interface PreviewErrorBoundaryProps {
    children: ReactNode;
    /** Shown in the fallback message, e.g. "base/carousel/carousel#CarouselIndicator". */
    label: string;
}

interface PreviewErrorBoundaryState {
    error: Error | null;
}

/**
 * The showcase mechanically renders hundreds of exports straight out of
 * the library's real *.demo.tsx files (see ComponentPreview). A handful
 * of those exports are internal helpers -- render-prop functions passed
 * to a parent (e.g. a custom recharts tick/tooltip renderer), or
 * sub-components that only work inside a specific parent context (e.g.
 * `useCarousel` requiring a `<Carousel>` ancestor) -- not standalone
 * components. Rather than one such export taking down an entire doc
 * page with a 500, this boundary catches the render error locally and
 * shows an inline note so every *other* example on the page still
 * renders normally.
 */
export class PreviewErrorBoundary extends Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
    state: PreviewErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-secondary p-6 text-center">
                    <p className="text-sm font-medium text-secondary">Couldn't render this example in isolation</p>
                    <p className="max-w-md text-xs text-tertiary">
                        <code>{this.props.label}</code> likely expects a parent context (e.g. it's an internal sub-component or render-prop helper) rather than
                        being renderable on its own. See the Code tab for its real usage.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
