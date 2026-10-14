"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import { Accordion } from "@/components/application/accordion/accordion";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { AlertCircle, Briefcase01, ChevronRight, Copy01, CreditCard01, Lock01, Star01, Truck01 } from "@/components/foundations/icons";

export const SingleOpenDemo = () => (
    <Accordion defaultExpandedKeys={["shipping"]} className="max-w-md">
        <Accordion.Item id="shipping">
            <Accordion.Trigger>What are your shipping options?</Accordion.Trigger>
            <Accordion.Panel>We offer standard (5–7 days), express (2–3 days), and overnight shipping at checkout.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="returns">
            <Accordion.Trigger>What's your return policy?</Accordion.Trigger>
            <Accordion.Panel>Items can be returned within 30 days of delivery for a full refund, provided they're unused.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="warranty">
            <Accordion.Trigger>Do you offer a warranty?</Accordion.Trigger>
            <Accordion.Panel>All products include a 1-year limited warranty covering manufacturing defects.</Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const MultiOpenDemo = () => (
    <Accordion allowsMultipleExpanded defaultExpandedKeys={["shipping", "returns"]} className="max-w-md">
        <Accordion.Item id="shipping">
            <Accordion.Trigger>What are your shipping options?</Accordion.Trigger>
            <Accordion.Panel>We offer standard, express, and overnight shipping at checkout.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="returns">
            <Accordion.Trigger>What's your return policy?</Accordion.Trigger>
            <Accordion.Panel>Items can be returned within 30 days of delivery for a full refund.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="warranty">
            <Accordion.Trigger>Do you offer a warranty?</Accordion.Trigger>
            <Accordion.Panel>All products include a 1-year limited warranty.</Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const ControlledDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(["step-1"]));

    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setExpandedKeys(new Set(["step-1", "step-2", "step-3"]))}
                    className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-brand-secondary hover:underline"
                >
                    Expand all
                </button>
                <button
                    type="button"
                    onClick={() => setExpandedKeys(new Set())}
                    className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-tertiary hover:underline"
                >
                    Collapse all
                </button>
            </div>
            <Accordion allowsMultipleExpanded expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
                <Accordion.Item id="step-1">
                    <Accordion.Trigger icon={CreditCard01}>1. Payment details</Accordion.Trigger>
                    <Accordion.Panel>Card number, expiry, and billing address.</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item id="step-2">
                    <Accordion.Trigger icon={Truck01}>2. Shipping address</Accordion.Trigger>
                    <Accordion.Panel>Where should we send your order?</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item id="step-3">
                    <Accordion.Trigger icon={Lock01}>3. Review & confirm</Accordion.Trigger>
                    <Accordion.Panel>Double-check everything before placing the order.</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export const DisabledItemDemo = () => (
    <Accordion className="max-w-md">
        <Accordion.Item id="available">
            <Accordion.Trigger>Available section</Accordion.Trigger>
            <Accordion.Panel>This section can be toggled normally.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="locked" isDisabled>
            <Accordion.Trigger>
                <span className="flex items-center gap-2">
                    Locked section <Badge size="sm">Pro</Badge>
                </span>
            </Accordion.Trigger>
            <Accordion.Panel>Upgrade to unlock this content.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="another">
            <Accordion.Trigger>Another available section</Accordion.Trigger>
            <Accordion.Panel>Focus skips disabled items when navigating with arrow keys.</Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const EmptyPanelDemo = () => (
    <Accordion className="max-w-md">
        <Accordion.Item id="no-attachments" defaultExpanded>
            <Accordion.Trigger>Attachments</Accordion.Trigger>
            <Accordion.Panel>
                <p className="text-tertiary italic">No attachments have been added yet.</p>
            </Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const LongContentDemo = () => (
    <Accordion className="max-w-md">
        <Accordion.Item id="terms" defaultExpanded>
            <Accordion.Trigger>Terms of service</Accordion.Trigger>
            <Accordion.Panel>
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <p key={index}>
                            Section {index + 1}: This paragraph demonstrates that the panel expands naturally to fit arbitrarily long content — it grows the
                            page rather than clipping or scrolling internally.
                        </p>
                    ))}
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const NestedDemo = () => (
    <Accordion className="max-w-md">
        <Accordion.Item id="account">
            <Accordion.Trigger>Account settings</Accordion.Trigger>
            <Accordion.Panel>
                <Accordion className="border-t border-secondary">
                    <Accordion.Item id="profile">
                        <Accordion.Trigger>Profile</Accordion.Trigger>
                        <Accordion.Panel>Name, avatar, and bio.</Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item id="security">
                        <Accordion.Trigger>Security</Accordion.Trigger>
                        <Accordion.Panel>Password and two-factor authentication.</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="billing">
            <Accordion.Trigger>Billing</Accordion.Trigger>
            <Accordion.Panel>Manage your plan and payment methods.</Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

export const SizesDemo = () => (
    <div className="flex w-full max-w-md flex-col gap-8">
        <Accordion size="sm" defaultExpandedKeys={["a"]}>
            <Accordion.Item id="a">
                <Accordion.Trigger>Small size</Accordion.Trigger>
                <Accordion.Panel>Tighter padding and smaller text.</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
        <Accordion size="md" defaultExpandedKeys={["b"]}>
            <Accordion.Item id="b">
                <Accordion.Trigger>Medium size</Accordion.Trigger>
                <Accordion.Panel>The default, roomier size.</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </div>
);

export const VariantsDemo = () => (
    <div className="flex w-full max-w-md flex-col gap-8">
        {(["divider", "card", "filled"] as const).map((variant) => (
            <Accordion key={variant} variant={variant} allowsMultipleExpanded defaultExpandedKeys={["a"]}>
                <Accordion.Item id="a">
                    <Accordion.Trigger>Work experience</Accordion.Trigger>
                    <Accordion.Panel>The {variant} variant, expanded.</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item id="b">
                    <Accordion.Trigger>Education</Accordion.Trigger>
                    <Accordion.Panel>The {variant} variant, second item.</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        ))}
    </div>
);

const ReviewCard = ({ children }: { children: string }) => (
    <div className="rounded-xl border border-secondary bg-primary p-3 text-sm text-secondary">{children}</div>
);

export const BadgeDemo = () => (
    <Accordion variant="badge" allowsMultipleExpanded defaultExpandedKeys={["strength", "fixes"]} className="max-w-md">
        <Accordion.Item id="strength">
            <Accordion.Trigger icon={Star01} badgeColor="brand">
                Strength
            </Accordion.Trigger>
            <Accordion.Panel>
                <ReviewCard>Clear opening that names the role and company.</ReviewCard>
            </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="fixes">
            <Accordion.Trigger icon={AlertCircle} badgeColor="error">
                Important fixes
            </Accordion.Trigger>
            <Accordion.Panel>
                <ReviewCard>Quantify the impact of your last project.</ReviewCard>
                <ReviewCard>Mention the hiring manager by name.</ReviewCard>
            </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="grammar">
            <Accordion.Trigger icon={AlertCircle}>Grammar</Accordion.Trigger>
            <Accordion.Panel>
                <ReviewCard>No grammar issues found.</ReviewCard>
            </Accordion.Panel>
        </Accordion.Item>
    </Accordion>
);

const ReviewIssueBody = ({ problem, suggestion }: { problem: string; suggestion: string }) => (
    <div className="flex flex-col gap-2.5">
        <div className="flex flex-col items-start gap-3 rounded-[10px] bg-tertiary px-3 py-2.5">
            <p className="text-sm font-semibold text-primary">Problem</p>
            <p className="text-sm font-medium text-primary">{problem}</p>
            <Button color="link-gray" size="sm" iconTrailing={ChevronRight}>
                Why it matters
            </Button>
        </div>
        <Accordion variant="suggestion" defaultExpandedKeys={["suggestion"]}>
            <Accordion.Item id="suggestion">
                <Accordion.Trigger>Suggested improvement</Accordion.Trigger>
                <Accordion.Panel>
                    <div className="flex flex-col items-start gap-2.5">
                        <p>{suggestion}</p>
                        <Button color="tertiary" size="xs" iconLeading={Copy01}>
                            Copy
                        </Button>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    </div>
);

export const IssueDemo = () => {
    const [active, setActive] = useState<Key>("company");

    return (
        <Accordion variant="badge" defaultExpandedKeys={["alignment"]} className="max-w-md">
            <Accordion.Item id="alignment">
                <Accordion.Trigger icon={Briefcase01} badgeColor="error">
                    Job alignment
                </Accordion.Trigger>
                <Accordion.Panel>
                    <Accordion variant="issue" defaultExpandedKeys={["company"]} onExpandedChange={(keys) => keys.size && setActive([...keys][0])}>
                        <Accordion.Item id="company" isActive={active === "company"}>
                            <Accordion.Trigger>Letter targets wrong company and job</Accordion.Trigger>
                            <Accordion.Panel>
                                <ReviewIssueBody
                                    problem="Your letter applies for Marketing Coordinator at Brightline Solutions. The job description is for Manager Warehouse & Operations at Hellmann Worldwide Logistics."
                                    suggestion="I am applying for the Manager Warehouse & Operations position at Hellmann Worldwide Logistics."
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item id="field" isActive={active === "field"}>
                            <Accordion.Trigger>Your notes point to a different field than this job</Accordion.Trigger>
                            <Accordion.Panel>
                                <ReviewIssueBody
                                    problem="The qualification you asked to reference in your notes belongs to a different field from the attached job."
                                    suggestion="Lead with the operations and systems experience that matches this role."
                                />
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};
