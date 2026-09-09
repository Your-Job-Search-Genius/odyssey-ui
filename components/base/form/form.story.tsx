import type { FC } from "react";
import * as Forms from "@/components/base/form/form.demo";

export default {
    title: "Base components/Form",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Forms.FormDemo />;

export const WithReactHookForm = () => <Forms.HookFormDemo />;
WithReactHookForm.storyName = "With react-hook-form";

export const WithValidationRules = () => <Forms.SignUpFormDemo />;
WithValidationRules.storyName = "With validation rules";

export const MixedFieldTypes = () => <Forms.ProfileFormDemo />;
MixedFieldTypes.storyName = "Mixed field types";

export const AsyncSubmit = () => <Forms.AsyncSubmitFormDemo />;
AsyncSubmit.storyName = "Async submit with server error";

export const ConditionalFields = () => <Forms.ConditionalFieldsFormDemo />;
ConditionalFields.storyName = "Conditional fields";
