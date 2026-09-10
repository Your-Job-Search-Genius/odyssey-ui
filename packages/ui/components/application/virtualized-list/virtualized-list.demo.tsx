"use client";

import { useEffect, useState } from "react";
import { useAsyncList } from "react-stately";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { VirtualizedList } from "@/components/application/virtualized-list/virtualized-list";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { AlertCircle, SearchLg, UsersX } from "@/components/foundations/icons";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

// ---------------------------------------------------------------------------
// Synthetic dataset + mock "server". None of this belongs in a real app — it
// exists purely to give the demos below something realistic to virtualize
// and paginate against.
// ---------------------------------------------------------------------------

interface Person {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "invited" | "suspended";
}

const FIRST_NAMES = [
    "Olivia",
    "Phoenix",
    "Lana",
    "Demi",
    "Candice",
    "Natali",
    "Drew",
    "Orlando",
    "Andi",
    "Kate",
    "Amélie",
    "Sienna",
    "Caitlyn",
    "Marco",
    "Priya",
    "Jonas",
];
const LAST_NAMES = [
    "Rhye",
    "Baptista",
    "Steiner",
    "Wilkinson",
    "Wall",
    "Craig",
    "Cano",
    "Diggs",
    "Lane",
    "Morrison",
    "Rivera",
    "Hewitt",
    "King",
    "Alves",
    "Sharma",
    "Weber",
];
const ROLES = ["Product designer", "Frontend engineer", "Backend engineer", "Support lead", "Sales manager", "Marketing lead", "Data analyst"];
const STATUSES: Person["status"][] = ["active", "active", "active", "invited", "suspended"];

/** Deterministic pseudo-random generator seeded by index, so the dataset is stable across re-renders. */
function seededRandom(seed: number) {
    let t = seed;
    return () => {
        t += 0x6d2b79f5;
        let x = Math.imul(t ^ (t >>> 15), t | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

const TOTAL_PEOPLE = 12000;

const ALL_PEOPLE: Person[] = Array.from({ length: TOTAL_PEOPLE }, (_, index) => {
    const random = seededRandom(index + 1);
    const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    return {
        id: `person-${index}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
        role: ROLES[Math.floor(random() * ROLES.length)],
        status: STATUSES[Math.floor(random() * STATUSES.length)],
    };
});

/** Rejects with an `AbortError` when `signal` fires, otherwise resolves after `ms`. */
function wait(ms: number, signal: AbortSignal) {
    return new Promise<void>((resolve, reject) => {
        if (signal.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }
        const timeout = setTimeout(resolve, ms);
        signal.addEventListener(
            "abort",
            () => {
                clearTimeout(timeout);
                reject(new DOMException("Aborted", "AbortError"));
            },
            { once: true },
        );
    });
}

const PAGE_SIZE = 40;
/** Chance that a given "server" call fails, so the error/retry UI has something to demonstrate. */
const FAILURE_RATE = 0.08;

/**
 * Stands in for a real paginated, filterable API endpoint: it simulates network latency,
 * occasional transient failures, and server-side filtering — and honors `signal` so an
 * in-flight call can be cancelled (e.g. when the user types again before the previous
 * request resolved).
 */
async function fetchPeopleFromServer({ page, filterText, signal }: { page: number; filterText?: string; signal: AbortSignal }) {
    await wait(400 + Math.random() * 500, signal);

    if (Math.random() < FAILURE_RATE) {
        throw new Error("The server returned an unexpected response. Please try again.");
    }

    const normalizedFilter = filterText?.trim().toLowerCase();
    const filtered = normalizedFilter
        ? ALL_PEOPLE.filter((person) => person.name.toLowerCase().includes(normalizedFilter) || person.email.toLowerCase().includes(normalizedFilter))
        : ALL_PEOPLE;

    const items = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    const nextPage = page * PAGE_SIZE + PAGE_SIZE < filtered.length ? page + 1 : undefined;

    return { items, nextPage };
}

const statusColor: Record<Person["status"], "success" | "warning" | "gray"> = {
    active: "success",
    invited: "warning",
    suspended: "gray",
};

const PersonRow = ({ person }: { person: Person }) => (
    <div className="flex w-full items-center gap-3">
        <Avatar initials={person.name.slice(0, 2).toUpperCase()} size="md" />
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-primary">{person.name}</p>
            <p className="truncate text-sm text-tertiary">{person.email}</p>
        </div>
        <span className="hidden text-sm text-tertiary sm:block">{person.role}</span>
        <BadgeWithDot size="sm" color={statusColor[person.status]} type="modern" className="capitalize">
            {person.status}
        </BadgeWithDot>
    </div>
);

// ---------------------------------------------------------------------------
// Demos
// ---------------------------------------------------------------------------

export const BasicLargeListDemo = () => (
    <VirtualizedList items={ALL_PEOPLE} rowHeight={64} aria-label="12,000 people" getTextValue={(person) => person.name}>
        {(person) => <PersonRow person={person} />}
    </VirtualizedList>
);

const VARIABLE_HEIGHT_PEOPLE = ALL_PEOPLE.slice(0, 500).map((person, index) => ({
    ...person,
    bio:
        index % 3 === 0
            ? "Joined the company last week."
            : index % 3 === 1
              ? "Leads onboarding for new hires and writes most of our internal documentation."
              : "Long-time team member. Previously worked on the platform, growth, and design systems teams across three different offices.",
}));

export const VariableHeightDemo = () => (
    <VirtualizedList
        items={VARIABLE_HEIGHT_PEOPLE}
        estimatedRowHeight={72}
        aria-label="People with variable-length bios"
        getTextValue={(person) => person.name}
    >
        {(person) => (
            <div className="flex w-full flex-col gap-1 py-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-primary">{person.name}</p>
                    <span className="text-xs text-quaternary">{person.role}</span>
                </div>
                <p className="text-sm text-tertiary">{person.bio}</p>
            </div>
        )}
    </VirtualizedList>
);

/**
 * The full "best practices" example: server-paginated infinite scroll via `useAsyncList`
 * (built-in request cancellation/de-duplication — starting a new load aborts the previous one
 * and stale results are discarded automatically), a debounced search box that re-queries from
 * page 1, loading-row placeholders, an error state with retry, and an empty state.
 */
export const ServerSyncedDemo = () => {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebouncedValue(searchInput, 400);

    const list = useAsyncList<Person>({
        async load({ cursor, filterText, signal }) {
            const page = cursor ? Number(cursor) : 0;
            const { items, nextPage } = await fetchPeopleFromServer({ page, filterText, signal });
            return { items, cursor: nextPage?.toString() };
        },
    });

    // Debounced so the server isn't queried on every keystroke; re-triggers `load` from page 1
    // because `useAsyncList` resets `cursor` whenever `filterText` changes.
    // `list` is intentionally omitted from the deps: `useAsyncList` returns a new object every
    // render, so watching it would re-fire this effect on every render and loop infinitely.
    useEffect(() => {
        list.setFilterText(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const isInitialLoading = (list.loadingState === "loading" || list.loadingState === "filtering") && list.items.length === 0;
    const isLoadingMore = list.loadingState === "loadingMore";

    return (
        <div className="flex w-full max-w-2xl flex-col gap-3">
            <Input icon={SearchLg} aria-label="Search people" placeholder="Search by name or email…" value={searchInput} onChange={setSearchInput} />

            {list.error ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl p-8 text-center ring-1 ring-secondary ring-inset">
                    <AlertCircle aria-hidden="true" className="size-8 text-fg-error-primary" />
                    <div>
                        <p className="text-sm font-semibold text-primary">Couldn't load results</p>
                        <p className="text-sm text-tertiary">{list.error.message}</p>
                    </div>
                    <Button size="sm" color="secondary" onPress={() => list.reload()}>
                        Retry
                    </Button>
                </div>
            ) : isInitialLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl ring-1 ring-secondary ring-inset">
                    <LoadingIndicator type="line-spinner" size="md" label="Loading people…" />
                </div>
            ) : (
                <VirtualizedList
                    items={list.items}
                    rowHeight={64}
                    aria-label="Search results"
                    getTextValue={(person) => person.name}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={() => {
                        if (list.loadingState === "idle") list.loadMore();
                    }}
                    scrollRestorationKey={`people-search:${debouncedSearch}`}
                    renderEmptyState={() => (
                        <div className="flex h-64 flex-col items-center justify-center gap-1 p-8 text-center">
                            <UsersX aria-hidden="true" className="mb-2 size-8 text-fg-quaternary" />
                            <p className="text-sm font-semibold text-primary">No people found</p>
                            <p className="text-sm text-tertiary">Try a different search term.</p>
                        </div>
                    )}
                >
                    {(person) => <PersonRow person={person} />}
                </VirtualizedList>
            )}

            <p className="text-xs text-quaternary">
                {list.items.length.toLocaleString()} loaded{list.error ? "" : " — scroll to the end to fetch more."} Requests occasionally fail (~
                {Math.round(FAILURE_RATE * 100)}%) to demonstrate the retry flow.
            </p>
        </div>
    );
};

export const SelectableDemo = () => (
    <VirtualizedList
        items={ALL_PEOPLE.slice(0, 1000)}
        rowHeight={64}
        aria-label="Selectable people"
        selectionMode="multiple"
        getTextValue={(person) => person.name}
    >
        {(person) => <PersonRow person={person} />}
    </VirtualizedList>
);

export const EmptyStateDemo = () => (
    <VirtualizedList
        items={[]}
        rowHeight={64}
        aria-label="Empty list"
        renderEmptyState={() => (
            <div className="flex h-64 flex-col items-center justify-center gap-1 p-8 text-center">
                <UsersX aria-hidden="true" className="mb-2 size-8 text-fg-quaternary" />
                <p className="text-sm font-semibold text-primary">No team members yet</p>
                <p className="text-sm text-tertiary">Invite someone to get started.</p>
            </div>
        )}
    >
        {(person: Person) => <PersonRow person={person} />}
    </VirtualizedList>
);
