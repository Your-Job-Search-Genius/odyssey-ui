"use client";

import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { DescriptionList } from "@/components/base/description-list/description-list";

export const DefaultDemo = () => (
    <DescriptionList columns={2} className="w-full max-w-2xl">
        <DescriptionList.Item term="Campaign">Fall outreach</DescriptionList.Item>
        <DescriptionList.Item term="Status">
            <BadgeWithDot color="success" type="pill-color" size="sm">
                Active
            </BadgeWithDot>
        </DescriptionList.Item>
        <DescriptionList.Item term="Sender">outreach@example.com</DescriptionList.Item>
        <DescriptionList.Item term="Audience">1,284 contacts</DescriptionList.Item>
        <DescriptionList.Item term="Workflow">
            <Button href="#" color="link-color" size="sm">
                Five-step nurture with a long name that wraps
            </Button>
        </DescriptionList.Item>
        <DescriptionList.Item term="Ends">{null}</DescriptionList.Item>
    </DescriptionList>
);

export const InlineDemo = () => (
    <DescriptionList layout="inline" isDivided className="w-full max-w-xl">
        <DescriptionList.Item term="Throttle">40 emails / minute</DescriptionList.Item>
        <DescriptionList.Item term="IP pool">Shared (warm)</DescriptionList.Item>
        <DescriptionList.Item term="Language">English</DescriptionList.Item>
        <DescriptionList.Item term="Guard policy">Pause on 3% bounce rate</DescriptionList.Item>
    </DescriptionList>
);
