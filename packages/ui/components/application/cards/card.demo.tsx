"use client";

import { useState } from "react";
import { Card } from "@/components/application/cards/card";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { DotsVertical, Star01 } from "@/components/foundations/icons";

export const BasicDemo = () => (
    <Card className="max-w-80">
        <Card.Header title="Team workspace" description="Everything your team needs, all in one shared place." />
        <Card.Body>Invite teammates, share files, and track progress together without leaving the app.</Card.Body>
        <Card.Footer>
            <Badge color="brand" size="sm">
                Free plan
            </Badge>
            <Button size="sm" color="secondary">
                Manage
            </Button>
        </Card.Footer>
    </Card>
);

export const WithMediaDemo = () => (
    <Card className="max-w-80">
        <Card.Media
            src="https://www.untitledui.com/images/photos/mira-collins.jpg"
            alt="A team collaborating around a laptop in a bright office"
            aspectRatio="video"
        />
        <Card.Header
            title="Product roadmap Q3"
            description="A look at what we're shipping in the next quarter."
            actions={<ButtonUtility size="xs" color="tertiary" icon={DotsVertical} tooltip="More actions" />}
        />
        <Card.Body>Includes new virtualization primitives, accordion animations, and a refreshed card system.</Card.Body>
        <Card.Footer>
            <span className="text-xs text-quaternary">Updated 2 days ago</span>
            <Button size="sm" color="link-color">
                Read more
            </Button>
        </Card.Footer>
    </Card>
);

export const ClickableLinkDemo = () => (
    <Card href="https://www.untitledui.com" className="max-w-80" elevation="sm">
        <Card.Header title="Documentation" description="Browse guides, API references, and code examples." />
        <Card.Body>Opens in a new context — the whole card is a single accessible link.</Card.Body>
    </Card>
);

export const ClickableButtonDemo = () => {
    const [selectedId, setSelectedId] = useState<string | null>("starter");

    const plans = [
        { id: "starter", name: "Starter", price: "$0", description: "For individuals just getting started." },
        { id: "growth", name: "Growth", price: "$29", description: "For small teams that need more power." },
        { id: "scale", name: "Scale", price: "$99", description: "For organizations with advanced needs." },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
                <Card key={plan.id} onPress={() => setSelectedId(plan.id)} isSelected={selectedId === plan.id} size="sm" aria-pressed={selectedId === plan.id}>
                    <Card.Header title={plan.name} description={plan.description} />
                    <Card.Body>
                        <span className="text-xl font-semibold text-primary">{plan.price}</span>
                        <span className="text-tertiary"> / month</span>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export const StaticDemo = () => (
    <Card className="max-w-80">
        <Card.Header title="Storage usage" description="You're using 68% of your available storage." />
        <Card.Body>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[68%] rounded-full bg-brand-solid" />
            </div>
        </Card.Body>
    </Card>
);

export const LoadingDemo = () => (
    <Card isLoading className="max-w-80">
        <Card.Header title="This never renders while loading" />
        <Card.Body>Because `isLoading` swaps the content for a skeleton.</Card.Body>
    </Card>
);

export const DisabledDemo = () => (
    <Card href="/upgrade" isDisabled className="max-w-80">
        <Card.Header title="Enterprise plan" description="Contact sales to unlock this plan." />
        <Card.Body>This card is disabled — it cannot be focused, pressed, or navigated to.</Card.Body>
    </Card>
);

export const SelectedDemo = () => (
    <div className="grid grid-cols-2 gap-4">
        <Card onPress={() => {}} isSelected className="max-w-56">
            <Card.Header title="Selected" />
            <Card.Body>Shows the brand ring + checkmark badge.</Card.Body>
        </Card>
        <Card onPress={() => {}} className="max-w-56">
            <Card.Header title="Not selected" />
            <Card.Body>Default resting appearance.</Card.Body>
        </Card>
    </div>
);

export const SizesDemo = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card size="sm" className="max-w-64">
            <Card.Header title="Small" description="Compact padding" />
            <Card.Body>size=&quot;sm&quot;</Card.Body>
        </Card>
        <Card size="md" className="max-w-64">
            <Card.Header title="Medium" description="Default padding" />
            <Card.Body>size=&quot;md&quot;</Card.Body>
        </Card>
        <Card size="lg" className="max-w-64">
            <Card.Header title="Large" description="Roomy padding" />
            <Card.Body>size=&quot;lg&quot;</Card.Body>
        </Card>
    </div>
);

export const ElevationsDemo = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["none", "xs", "sm", "md"] as const).map((elevation) => (
            <Card key={elevation} elevation={elevation} size="sm" className="max-w-48">
                <Card.Header title={elevation} />
                <Card.Body>elevation=&quot;{elevation}&quot;</Card.Body>
            </Card>
        ))}
    </div>
);

export const OverflowContentDemo = () => (
    <Card className="max-w-64">
        <Card.Header
            title="This is an extremely long card title that must truncate cleanly to a single line"
            description="This description is also quite long and demonstrates the two-line clamp so the card's footer never gets pushed out of view no matter how much text a real integration ends up passing in."
        />
        <Card.Body>Body content stays put underneath.</Card.Body>
        <Card.Footer>
            <span className="text-xs text-quaternary">Footer</span>
        </Card.Footer>
    </Card>
);

export const BrokenImageDemo = () => (
    <Card className="max-w-80">
        <Card.Media src="https://this-domain-does-not-exist.example/broken.jpg" alt="A photo that fails to load" aspectRatio="video" />
        <Card.Header title="Broken image fallback" description="The media slot falls back to a placeholder icon instead of a broken image gap." />
    </Card>
);

export const MediaFillsParentDemo = () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="max-w-80">
            {/* No `aspectRatio` — the media fills 100% of this `h-56` wrapper, whatever its ratio ends up being. */}
            <div className="h-56 w-full">
                <Card.Media src="https://www.untitledui.com/images/photos/interior-1.jpg" alt="A softly lit living room with a reading chair" />
            </div>
            <Card.Header title="Fixed-height wrapper" description="Card.Media stretches to fill the h-56 container above it exactly." />
        </Card>

        <Card className="h-80 max-w-80">
            {/* Same idea, but the wrapper grows to fill whatever space is left over in a fixed-height card. */}
            <div className="min-h-0 flex-1">
                <Card.Media src="https://this-domain-does-not-exist.example/broken.jpg" alt="A photo that fails to load" />
            </div>
            <Card.Header title="Flexible-height wrapper" description="The broken-image placeholder fills the same wrapper just as completely." />
        </Card>
    </div>
);

export const ProductGridDemo = () => {
    const products = [
        { id: "1", name: "Aurora desk lamp", price: "$89", rating: 4.8, image: "https://www.untitledui.com/images/photos/interior-1.jpg" },
        { id: "2", name: "Ceramic pour-over set", price: "$54", rating: 4.6, image: "https://www.untitledui.com/images/photos/interior-2.jpg" },
        { id: "3", name: "Woven storage basket", price: "$38", rating: 4.9, image: "https://www.untitledui.com/images/photos/interior-3.jpg" },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {products.map((product) => (
                <Card key={product.id} href={`/products/${product.id}`} size="sm">
                    <Card.Media src={product.image} alt={product.name} aspectRatio="square" />
                    <Card.Header
                        title={product.name}
                        description={
                            <span className="flex items-center gap-1">
                                <Star01 aria-hidden="true" className="size-3.5 text-warning-primary" />
                                {product.rating}
                            </span>
                        }
                    />
                    <Card.Footer>
                        <span className="text-md font-semibold text-primary">{product.price}</span>
                        <Button size="sm" color="secondary">
                            Add to cart
                        </Button>
                    </Card.Footer>
                </Card>
            ))}
        </div>
    );
};
