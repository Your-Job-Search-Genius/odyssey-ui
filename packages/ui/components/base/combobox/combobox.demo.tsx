"use client";

import { useCallback, useRef, useState } from "react";
import { useAsyncList } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { ComboBox } from "@/components/base/combobox/combobox";
import type { ComboBoxItemType } from "@/components/base/combobox/combobox";
import { Briefcase01, Building01, Plus } from "@/components/foundations/icons";

const teamMembers: ComboBoxItemType[] = [
    {
        label: "Phoenix Baker",
        id: "@phoenix",
        supportingText: "@phoenix",
        avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    },
    { label: "Olivia Rhye", id: "@olivia", supportingText: "@olivia", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { label: "Lana Steiner", id: "@lana", supportingText: "@lana", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    {
        label: "Demi Wilkinson",
        id: "@demi",
        supportingText: "@demi",
        isDisabled: true,
        avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    },
    { label: "Candice Wu", id: "@candice", supportingText: "@candice", avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80" },
    { label: "Natali Craig", id: "@natali", supportingText: "@natali", avatarUrl: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80" },
];

const roles: ComboBoxItemType[] = [
    { label: "Product Manager", id: "product-manager", icon: Briefcase01 },
    { label: "Engineering Manager", id: "engineering-manager", icon: Briefcase01 },
    { label: "Frontend Developer", id: "frontend-developer", icon: Briefcase01 },
    { label: "Backend Developer", id: "backend-developer", icon: Briefcase01 },
    { label: "Product Designer", id: "product-designer", icon: Briefcase01 },
];

const membersWithRoles: ComboBoxItemType[] = [
    {
        label: "Phoenix Baker",
        id: "@phoenix",
        description: "Engineering · Full-time",
        avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
        badgeLabel: "Admin",
        badgeColor: "brand",
    },
    {
        label: "Olivia Rhye",
        id: "@olivia",
        description: "Design · Part-time",
        avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
        badgeLabel: "Member",
        badgeColor: "gray",
    },
    {
        label: "Lana Steiner",
        id: "@lana",
        description: "Marketing · Full-time",
        avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
        badgeLabel: "Member",
        badgeColor: "gray",
    },
    {
        label: "Demi Wilkinson",
        id: "@demi",
        description: "Sales · Contractor",
        avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
        badgeLabel: "Pending",
        badgeColor: "warning",
    },
];

export const DefaultDemo = () => (
    <ComboBox label="Team member" placeholder="Search team members" items={teamMembers}>
        {(item) => (
            <ComboBox.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const AvatarLeadingDemo = () => (
    <ComboBox label="Team member" placeholder="Search team members" items={teamMembers}>
        {(item) => (
            <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl} isDisabled={item.isDisabled}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const IconLeadingDemo = () => (
    <ComboBox label="Role" placeholder="Search roles" icon={Briefcase01} items={roles}>
        {(item) => (
            <ComboBox.Item id={item.id} icon={item.icon}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const DescriptionAndBadgeDemo = () => (
    <ComboBox label="Assignee" hint="Shows a two-line description and a status badge." placeholder="Search team members" items={membersWithRoles}>
        {(item) => (
            <ComboBox.Item id={item.id} avatarUrl={item.avatarUrl} description={item.description} badgeLabel={item.badgeLabel} badgeColor={item.badgeColor}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const GroupedDemo = () => (
    <ComboBox label="Assignee" placeholder="Search people or teams">
        <ComboBox.Section label="Suggested">
            <ComboBox.Item id="@phoenix" avatarUrl="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" supportingText="@phoenix">
                Phoenix Baker
            </ComboBox.Item>
            <ComboBox.Item id="@olivia" avatarUrl="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" supportingText="@olivia">
                Olivia Rhye
            </ComboBox.Item>
        </ComboBox.Section>
        <ComboBox.Section label="Teams">
            <ComboBox.Item id="design" icon={Building01} supportingText="12 members">
                Design
            </ComboBox.Item>
            <ComboBox.Item id="engineering" icon={Building01} supportingText="24 members">
                Engineering
            </ComboBox.Item>
        </ComboBox.Section>
    </ComboBox>
);

export const WithFooterActionDemo = () => (
    <ComboBox
        label="Team member"
        placeholder="Search team members"
        items={teamMembers}
        footer={
            <ComboBox.Footer>
                <Button size="sm" color="link-color" iconLeading={Plus}>
                    Invite new member
                </Button>
            </ComboBox.Footer>
        }
    >
        {(item) => (
            <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl} isDisabled={item.isDisabled}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const EmptyStateDemo = () => (
    <ComboBox
        label="Team member"
        placeholder="Try searching for anything"
        items={[]}
        renderEmptyState={() => <ComboBox.EmptyState title="No team members" description="No one matches that search yet." />}
    >
        {(item: ComboBoxItemType) => <ComboBox.Item id={item.id}>{item.label}</ComboBox.Item>}
    </ComboBox>
);

export const DisabledDemo = () => (
    <ComboBox label="Team member" placeholder="Search team members" items={teamMembers} isDisabled>
        {(item) => (
            <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const InvalidDemo = () => (
    <ComboBox label="Team member" placeholder="Search team members" items={teamMembers} isInvalid hint="Please select a valid team member.">
        {(item) => (
            <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl}>
                {item.label}
            </ComboBox.Item>
        )}
    </ComboBox>
);

export const SizesDemo = () => (
    <div className="flex flex-col gap-6">
        <ComboBox size="sm" label="Small" placeholder="Search team members" items={teamMembers}>
            {(item) => (
                <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl}>
                    {item.label}
                </ComboBox.Item>
            )}
        </ComboBox>
        <ComboBox size="md" label="Medium" placeholder="Search team members" items={teamMembers}>
            {(item) => (
                <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl}>
                    {item.label}
                </ComboBox.Item>
            )}
        </ComboBox>
        <ComboBox size="lg" label="Large" placeholder="Search team members" items={teamMembers}>
            {(item) => (
                <ComboBox.Item id={item.id} supportingText={item.supportingText} avatarUrl={item.avatarUrl}>
                    {item.label}
                </ComboBox.Item>
            )}
        </ComboBox>
    </div>
);

// Simulates a network request: filters the "server-side" dataset after a short,
// abortable delay so switching searches quickly doesn't race stale responses.
const remoteDirectory: ComboBoxItemType[] = [
    { label: "Phoenix Baker", id: "@phoenix", description: "Engineering", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { label: "Olivia Rhye", id: "@olivia", description: "Design", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { label: "Lana Steiner", id: "@lana", description: "Marketing", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { label: "Demi Wilkinson", id: "@demi", description: "Sales", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80" },
    { label: "Candice Wu", id: "@candice", description: "Support", avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80" },
    { label: "Natali Craig", id: "@natali", description: "Engineering", avatarUrl: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80" },
    { label: "Abraham Baker", id: "@abraham", description: "Design", avatarUrl: "https://www.untitledui.com/images/avatars/abraham-baker?fm=webp&q=80" },
    { label: "Adem Lane", id: "@adem", description: "Engineering", avatarUrl: "https://www.untitledui.com/images/avatars/adem-lane?fm=webp&q=80" },
];

async function fetchDirectoryFromServer(query: string, signal: AbortSignal): Promise<ComboBoxItemType[]> {
    // Replace with a real request, e.g. `fetch(\`/api/users?q=${query}\`, { signal })`.
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 700);
        signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
        });
    });

    return remoteDirectory.filter((item) => item.label?.toLowerCase().includes(query.toLowerCase()));
}

export const AsyncServerSyncDemo = () => {
    const list = useAsyncList<ComboBoxItemType>({
        async load({ filterText, signal }) {
            const items = await fetchDirectoryFromServer(filterText ?? "", signal);
            return { items };
        },
    });

    return (
        <ComboBox
            label="Assignee"
            hint="Options are fetched from the server as you type, with in-flight requests cancelled automatically."
            placeholder="Search the directory"
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            isLoading={list.isLoading}
        >
            {(item) => (
                <ComboBox.Item id={item.id} avatarUrl={item.avatarUrl} supportingText={item.description}>
                    {item.label}
                </ComboBox.Item>
            )}
        </ComboBox>
    );
};

// A hand-rolled, debounced variant for backends that only expect one request per pause in typing.
export const AsyncServerSyncDebouncedDemo = () => {
    const [items, setItems] = useState<ComboBoxItemType[]>(remoteDirectory);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const runSearch = useDebouncedServerSearch(setItems, setIsLoading);

    const onInputChange = useCallback(
        (value: string) => {
            setInputValue(value);
            runSearch(value);
        },
        [runSearch],
    );

    return (
        <ComboBox
            label="Assignee (debounced)"
            hint="Waits 400ms after you stop typing before syncing with the server."
            placeholder="Search the directory"
            items={items}
            inputValue={inputValue}
            onInputChange={onInputChange}
            isLoading={isLoading}
        >
            {(item) => (
                <ComboBox.Item id={item.id} avatarUrl={item.avatarUrl} supportingText={item.description}>
                    {item.label}
                </ComboBox.Item>
            )}
        </ComboBox>
    );
};

function useDebouncedServerSearch(setItems: (items: ComboBoxItemType[]) => void, setIsLoading: (isLoading: boolean) => void) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    return useCallback(
        (query: string) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            controllerRef.current?.abort();

            setIsLoading(true);

            timerRef.current = setTimeout(async () => {
                const nextController = new AbortController();
                controllerRef.current = nextController;

                try {
                    const items = await fetchDirectoryFromServer(query, nextController.signal);
                    setItems(items);
                } catch {
                    // Aborted: a newer keystroke superseded this request.
                } finally {
                    setIsLoading(false);
                }
            }, 400);
        },
        [setItems, setIsLoading],
    );
}
