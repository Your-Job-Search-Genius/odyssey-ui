import type { FC } from "react";
import { Input } from "@/components/base/input/input";
import * as Inputs from "@/components/base/input/inputs.demo";
import { Select } from "@/components/base/select/select";

export default {
    title: "Base components/Inputs",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

const DefaultDecorator = (Story: FC) => (
    <div className="w-full max-w-xs">
        <Story />
    </div>
);

const WiderDecorator = (Story: FC) => (
    <div className="w-full max-w-100">
        <Story />
    </div>
);

export const Default = () => <Inputs.Default />;
Default.decorators = [DefaultDecorator];

export const LeadingIcon = () => <Inputs.LeadingIcon />;
LeadingIcon.decorators = [DefaultDecorator];
LeadingIcon.storyName = "Leading icon";

export const LeadingDropdown = () => <Inputs.LeadingDropdown />;
LeadingDropdown.decorators = [DefaultDecorator];
LeadingDropdown.storyName = "Leading dropdown";

export const TrailingDropdown = () => <Inputs.TrailingDropdown />;
TrailingDropdown.decorators = [DefaultDecorator];
TrailingDropdown.storyName = "Trailing dropdown";

export const LeadingText = () => <Inputs.LeadingText />;
LeadingText.decorators = [DefaultDecorator];
LeadingText.storyName = "Leading text";

export const PaymentInputs = () => <Inputs.PaymentInputs />;
PaymentInputs.decorators = [DefaultDecorator];
PaymentInputs.storyName = "Payment inputs";

export const TrailingButton = () => <Inputs.TrailingButton />;
TrailingButton.decorators = [WiderDecorator];
TrailingButton.storyName = "Trailing button";

export const PasswordInputs = () => <Inputs.PasswordInputs />;
PasswordInputs.decorators = [DefaultDecorator];
PasswordInputs.storyName = "Password inputs";

export const DateInputs = () => <Inputs.DateInputs />;
DateInputs.decorators = [DefaultDecorator];
DateInputs.storyName = "Date inputs";

export const NumberInputsHorizontal = () => <Inputs.NumberInputsHorizontal />;
NumberInputsHorizontal.decorators = [DefaultDecorator];
NumberInputsHorizontal.storyName = "Number inputs horizontal";

export const NumberInputsVertical = () => <Inputs.NumberInputsVertical />;
NumberInputsVertical.decorators = [DefaultDecorator];
NumberInputsVertical.storyName = "Number inputs vertical";

export const FileUploadInput = () => <Inputs.FileUploadInputs />;
FileUploadInput.decorators = [WiderDecorator];
FileUploadInput.storyName = "File upload input";

export const Tags = () => <Inputs.TagInputs />;
Tags.decorators = [WiderDecorator];
Tags.storyName = "Tag inputs inner";

export const TagsOuter = () => <Inputs.TagInputsOuter />;
TagsOuter.decorators = [WiderDecorator];
TagsOuter.storyName = "Tag inputs outer";

/** BetterShot P17 "Basic Details": Input + Select in the persona section card (#FAFAFA r20 p16; the Card variant is group E's). */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <section className="flex w-[438px] flex-col gap-[26px] rounded-[20px] bg-[#FAFAFA] p-4">
            <div className="flex flex-col gap-[5px]">
                <h2 className="text-[18px] leading-[23px] font-semibold text-black">Basic Details</h2>
                <p className="text-sm leading-[18px] font-medium text-subtle">Some basic information about you</p>
            </div>
            <div className="flex gap-9">
                <Input label="Age" defaultValue="29" />
                <Select
                    label="Sex"
                    defaultSelectedKey="male"
                    className="w-full"
                    items={[
                        { id: "male", label: "Male" },
                        { id: "female", label: "Female" },
                    ]}
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>
        </section>
    </div>
);

/** States not drawn in Figma, restyled: placeholder, hint, invalid, disabled, and the sm / lg sizes. */
export const FigmaStates = () => (
    <div data-compare className="inline-flex w-96 flex-col items-start gap-4 bg-white p-0">
        <Input label="Placeholder" placeholder="Enter your age" hint="This is a helper text" />
        <Input label="Invalid" defaultValue="290" isInvalid hint="Enter an age between 16 and 99." />
        <Input label="Disabled" defaultValue="29" isDisabled />
        <Input label="Small" size="sm" defaultValue="29" />
        <Input label="Large" size="lg" defaultValue="29" />
    </div>
);
