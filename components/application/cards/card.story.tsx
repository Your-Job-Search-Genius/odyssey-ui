import type { FC } from "react";
import * as CardDemos from "@/components/application/cards/card.demo";

export default {
    title: "Application/Cards",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <CardDemos.BasicDemo />;

export const WithMedia = () => <CardDemos.WithMediaDemo />;
WithMedia.storyName = "With media + header actions";

export const ClickableLink = () => <CardDemos.ClickableLinkDemo />;
ClickableLink.storyName = "Clickable (as link)";

export const ClickableButton = () => <CardDemos.ClickableButtonDemo />;
ClickableButton.storyName = "Selectable (as button)";

export const Static = () => <CardDemos.StaticDemo />;
Static.storyName = "Static (non-interactive)";

export const Loading = () => <CardDemos.LoadingDemo />;
Loading.storyName = "Loading skeleton";

export const Disabled = () => <CardDemos.DisabledDemo />;

export const Selected = () => <CardDemos.SelectedDemo />;

export const Sizes = () => <CardDemos.SizesDemo />;

export const Elevations = () => <CardDemos.ElevationsDemo />;

export const OverflowContent = () => <CardDemos.OverflowContentDemo />;
OverflowContent.storyName = "Long title/description overflow";

export const BrokenImage = () => <CardDemos.BrokenImageDemo />;
BrokenImage.storyName = "Broken image fallback";

export const ProductGrid = () => <CardDemos.ProductGridDemo />;
ProductGrid.storyName = "Composed example: product grid";
