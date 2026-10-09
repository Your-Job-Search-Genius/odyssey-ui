"use client";

import { Dropdown } from "@/components/base/dropdown/dropdown";

export const DropdownIconSimple = () => (
    <Dropdown.Root>
        <Dropdown.DotsButton aria-label="File actions" />

        <Dropdown.Popover className="w-54">
            <Dropdown.Menu>
                <Dropdown.Section>
                    <Dropdown.Item addon="⌘X">Cut</Dropdown.Item>
                    <Dropdown.Item addon="⌘C">Copy</Dropdown.Item>
                    <Dropdown.Item addon="⌘V">Paste</Dropdown.Item>
                </Dropdown.Section>
                <Dropdown.Separator />
                <Dropdown.Section>
                    <Dropdown.Item>Edit</Dropdown.Item>
                    <Dropdown.Item>Duplicate</Dropdown.Item>
                    <Dropdown.Item variant="destructive">Delete</Dropdown.Item>
                </Dropdown.Section>
                <Dropdown.Separator />
                <Dropdown.Section>
                    <Dropdown.SubmenuTrigger>
                        <Dropdown.Item>View details</Dropdown.Item>
                        <Dropdown.Popover placement="right top" offset={-6} className="w-50">
                            <Dropdown.Menu>
                                <Dropdown.Item>Share</Dropdown.Item>
                                <Dropdown.Item>Save as</Dropdown.Item>
                                <Dropdown.Item>Archive</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown.SubmenuTrigger>
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);
