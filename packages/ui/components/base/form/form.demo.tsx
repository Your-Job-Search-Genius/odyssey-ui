"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { FormField, HookForm } from "@/components/base/form/hook-form";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import type { SelectItemType } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";

export const FormDemo = () => {
    return (
        <Form
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <Input isRequired label="Email" placeholder="you@company.com" type="email" />
            <Input isRequired label="Password" placeholder="••••••••" type="password" />
            <Button type="submit">Sign in</Button>
        </Form>
    );
};

interface HookFormValues {
    email: string;
    password: string;
}

export const HookFormDemo = () => {
    const form = useForm<HookFormValues>({ defaultValues: { email: "", password: "" } });

    return (
        <HookForm
            form={form}
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
            })}
        >
            <FormField control={form.control} name="email">
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Email"
                        placeholder="you@company.com"
                        type="email"
                    />
                )}
            </FormField>

            <FormField control={form.control} name="password">
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                    />
                )}
            </FormField>

            <Button type="submit">Sign in</Button>
        </HookForm>
    );
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

/**
 * Demonstrates field-level validation rules (required, pattern, min length, and
 * cross-field validation for a "confirm password" field) via `FormField`'s `rules` prop.
 */
export const SignUpFormDemo = () => {
    const form = useForm<SignUpFormValues>({
        mode: "onBlur",
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    return (
        <HookForm
            form={form}
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
            })}
        >
            <FormField control={form.control} name="name" rules={{ required: "Please enter your name." }}>
                {({ field, fieldState }) => (
                    <Input {...field} isRequired isInvalid={fieldState.invalid} hint={fieldState.error?.message} label="Full name" placeholder="Olivia Rhye" />
                )}
            </FormField>

            <FormField
                control={form.control}
                name="email"
                rules={{
                    required: "Please enter your email.",
                    pattern: { value: EMAIL_PATTERN, message: "Please enter a valid email address." },
                }}
            >
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Email"
                        placeholder="you@company.com"
                        type="email"
                    />
                )}
            </FormField>

            <FormField
                control={form.control}
                name="password"
                rules={{
                    required: "Please enter a password.",
                    minLength: { value: 8, message: "Password must be at least 8 characters." },
                }}
            >
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                    />
                )}
            </FormField>

            <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                    required: "Please confirm your password.",
                    validate: (value) => value === form.getValues("password") || "Passwords do not match.",
                }}
            >
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Confirm password"
                        placeholder="••••••••"
                        type="password"
                    />
                )}
            </FormField>

            <Button type="submit">Create account</Button>
        </HookForm>
    );
};

const countries: SelectItemType[] = [
    { id: "us", label: "United States" },
    { id: "gb", label: "United Kingdom" },
    { id: "ca", label: "Canada" },
    { id: "au", label: "Australia" },
    { id: "de", label: "Germany" },
];

interface ProfileFormValues {
    fullName: string;
    country: string;
    bio: string;
    agreeToTerms: boolean;
}

/**
 * Demonstrates a single form composed of multiple field types (Input, Select,
 * Textarea, Checkbox), each wired through `FormField` to `react-hook-form`.
 */
export const ProfileFormDemo = () => {
    const form = useForm<ProfileFormValues>({
        defaultValues: { fullName: "", country: "", bio: "", agreeToTerms: false },
    });

    return (
        <HookForm
            form={form}
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
            })}
        >
            <FormField control={form.control} name="fullName" rules={{ required: "Please enter your name." }}>
                {({ field, fieldState }) => (
                    <Input {...field} isRequired isInvalid={fieldState.invalid} hint={fieldState.error?.message} label="Full name" placeholder="Olivia Rhye" />
                )}
            </FormField>

            <FormField control={form.control} name="country" rules={{ required: "Please select a country." }}>
                {({ field, fieldState }) => (
                    <Select
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Country"
                        placeholder="Select country"
                        items={countries}
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(key)}
                        onBlur={field.onBlur}
                    >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                )}
            </FormField>

            <FormField control={form.control} name="bio">
                {({ field, fieldState }) => (
                    <TextArea
                        {...field}
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Bio"
                        placeholder="Tell us about yourself"
                        rows={3}
                    />
                )}
            </FormField>

            <FormField control={form.control} name="agreeToTerms" rules={{ validate: (value) => value === true || "You must accept the terms to continue." }}>
                {({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                        <Checkbox
                            name={field.name}
                            ref={field.ref}
                            isSelected={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            label="I agree to the terms and conditions"
                        />
                        {fieldState.error && <p className="text-sm text-error-primary">{fieldState.error.message}</p>}
                    </div>
                )}
            </FormField>

            <Button type="submit">Save profile</Button>
        </HookForm>
    );
};

interface AsyncFormValues {
    email: string;
}

/**
 * Demonstrates an async submit handler: the submit button shows a loading state
 * (driven by `formState.isSubmitting`) while a simulated request is in flight, and a
 * simulated "server" validation error is surfaced back onto the field via `setError`.
 */
export const AsyncSubmitFormDemo = () => {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
    const form = useForm<AsyncFormValues>({ defaultValues: { email: "" } });

    const onValidSubmit = form.handleSubmit(async (data) => {
        // Simulate a network request.
        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (data.email === "taken@company.com") {
            form.setError("email", { type: "server", message: "This email is already registered." });
            return;
        }

        setSubmittedEmail(data.email);
    });

    return (
        <HookForm
            form={form}
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={(event) => {
                // Clear any previous success message as soon as a new submit is attempted, regardless
                // of whether this attempt turns out to be valid. Otherwise a stale "submitted" message
                // from an earlier successful submit stays on screen alongside a fresh validation error.
                setSubmittedEmail(null);
                onValidSubmit(event);
            }}
        >
            <FormField
                control={form.control}
                name="email"
                rules={{
                    required: "Please enter your email.",
                    pattern: { value: EMAIL_PATTERN, message: "Please enter a valid email address." },
                }}
            >
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message ?? "Try “taken@company.com” to see a simulated server error."}
                        label="Email"
                        placeholder="you@company.com"
                        type="email"
                    />
                )}
            </FormField>

            <Button type="submit" isLoading={form.formState.isSubmitting} showTextWhileLoading>
                {form.formState.isSubmitting ? "Submitting..." : "Join waitlist"}
            </Button>

            {submittedEmail && <p className="text-sm text-success-primary">You're on the list, {submittedEmail}!</p>}
        </HookForm>
    );
};

interface ShippingFormValues {
    email: string;
    shipToDifferentAddress: boolean;
    shippingAddress: string;
}

/**
 * Demonstrates a conditional field: `shippingAddress` is only rendered (and only
 * required) once "Ship to a different address" is checked, using `form.watch`.
 */
export const ConditionalFieldsFormDemo = () => {
    const form = useForm<ShippingFormValues>({
        defaultValues: { email: "", shipToDifferentAddress: false, shippingAddress: "" },
    });
    const shipToDifferentAddress = form.watch("shipToDifferentAddress");

    return (
        <HookForm
            form={form}
            className="flex w-full max-w-sm flex-col gap-4"
            onSubmit={form.handleSubmit((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
            })}
        >
            <FormField control={form.control} name="email" rules={{ required: "Please enter your email." }}>
                {({ field, fieldState }) => (
                    <Input
                        {...field}
                        isRequired
                        isInvalid={fieldState.invalid}
                        hint={fieldState.error?.message}
                        label="Email"
                        placeholder="you@company.com"
                        type="email"
                    />
                )}
            </FormField>

            <FormField control={form.control} name="shipToDifferentAddress">
                {({ field }) => (
                    <Checkbox
                        name={field.name}
                        ref={field.ref}
                        isSelected={field.value}
                        onChange={(isSelected) => {
                            field.onChange(isSelected);
                            if (!isSelected) form.resetField("shippingAddress");
                        }}
                        label="Ship to a different address"
                    />
                )}
            </FormField>

            {shipToDifferentAddress && (
                <FormField control={form.control} name="shippingAddress" rules={{ required: "Please enter a shipping address." }}>
                    {({ field, fieldState }) => (
                        <Input
                            {...field}
                            isRequired
                            isInvalid={fieldState.invalid}
                            hint={fieldState.error?.message}
                            label="Shipping address"
                            placeholder="123 Main St, Springfield"
                        />
                    )}
                </FormField>
            )}

            <Button type="submit">Continue</Button>
        </HookForm>
    );
};
