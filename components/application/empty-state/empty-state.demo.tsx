"use client";

import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { SearchLg, UsersPlus, Zap } from "@/components/foundations/icons";

const avatars = [
    { src: "https://www.untitledui.com/images/avatars/olivia-rhye" },
    { src: "https://www.untitledui.com/images/avatars/phoenix-baker" },
    { src: "https://www.untitledui.com/images/avatars/lana-steiner" },
    { src: "https://www.untitledui.com/images/avatars/demi-wilkinson" },
];

export const BasicDemo = () => (
    <EmptyState>
        <EmptyState.Header>
            <EmptyState.FeaturedIcon icon={SearchLg} color="gray" />
        </EmptyState.Header>
        <EmptyState.Content>
            <EmptyState.Title>No results found</EmptyState.Title>
            <EmptyState.Description>Your search did not match any results. Please try again.</EmptyState.Description>
        </EmptyState.Content>
        <EmptyState.Footer>
            <Button color="secondary">Clear search</Button>
            <Button>New search</Button>
        </EmptyState.Footer>
    </EmptyState>
);

export const WithIllustrationDemo = () => (
    <EmptyState>
        <EmptyState.Header>
            <EmptyState.Illustration type="cloud" />
        </EmptyState.Header>
        <EmptyState.Content>
            <EmptyState.Title>No files uploaded yet</EmptyState.Title>
            <EmptyState.Description>Upload a file to get started -- we support most common formats.</EmptyState.Description>
        </EmptyState.Content>
        <EmptyState.Footer>
            <Button iconLeading={Zap}>Upload a file</Button>
        </EmptyState.Footer>
    </EmptyState>
);

export const WithAvatarRowDemo = () => (
    <EmptyState>
        <EmptyState.Header pattern="grid">
            <EmptyState.AvatarRow avatars={avatars} />
        </EmptyState.Header>
        <EmptyState.Content>
            <EmptyState.Title>No team members yet</EmptyState.Title>
            <EmptyState.Description>Invite your team to start collaborating on this project.</EmptyState.Description>
        </EmptyState.Content>
        <EmptyState.Footer>
            <Button iconLeading={UsersPlus}>Invite team</Button>
        </EmptyState.Footer>
    </EmptyState>
);

export const SizesDemo = () => (
    <div className="flex flex-col gap-12">
        {(["sm", "md", "lg"] as const).map((size) => (
            <EmptyState key={size} size={size}>
                <EmptyState.Header>
                    <EmptyState.FeaturedIcon icon={SearchLg} color="gray" />
                </EmptyState.Header>
                <EmptyState.Content>
                    <EmptyState.Title>No results found ({size})</EmptyState.Title>
                    <EmptyState.Description>Your search did not match any results.</EmptyState.Description>
                </EmptyState.Content>
                <EmptyState.Footer>
                    <Button size={size === "lg" ? "lg" : "sm"}>New search</Button>
                </EmptyState.Footer>
            </EmptyState>
        ))}
    </div>
);
