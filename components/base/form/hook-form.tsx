import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { createContext, useContext, useId } from "react";
import { Form as AriaForm } from "react-aria-components";
import type { Control, FieldPath, FieldPathValue, FieldValues, RegisterOptions, UseControllerReturn, UseFormReturn } from "react-hook-form";
import { FormProvider, useController, useFormContext } from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues = FieldValues> extends ComponentPropsWithoutRef<typeof AriaForm> {
    form: UseFormReturn<TFieldValues>;
    children: ReactNode;
}

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    name: TName;
    control: Control<TFieldValues>;
    /** Validation rules, forwarded to `useController`. Supports `required`, `pattern`, `minLength`, `validate`, etc. */
    rules?: Omit<RegisterOptions<TFieldValues, TName>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
    /** Value to fall back to before the field has been touched. */
    defaultValue?: FieldPathValue<TFieldValues, TName>;
    children: ReactNode | ((control: UseControllerReturn<TFieldValues, TName>) => ReactNode);
}

interface FormFieldContextValues<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    id: string;
    name: TName;
    control?: UseControllerReturn<TFieldValues, TName>;
}

const FormFieldContext = createContext<FormFieldContextValues>({} as FormFieldContextValues);

export const useFormFieldContext = () => {
    const context = useContext(FormFieldContext);
    const { getFieldState, formState } = useFormContext();
    const fieldState = getFieldState(context.name, formState);

    if (!context) {
        throw new Error("The 'useFormContext' hook must be used within a '<FormField />'");
    }

    return { ...context, ...fieldState };
};

export const HookForm = <TFieldValues extends FieldValues = FieldValues>({ form, onSubmit, ...props }: FormProps<TFieldValues>) => {
    return (
        <FormProvider {...form}>
            <AriaForm
                // Let react-hook-form (via `FormField`'s aria-driven fields) own validation end to end, so our
                // own error hints/rings are what render — never the browser's native constraint-validation
                // tooltip, which would also steal focus away from our styled invalid field.
                validationBehavior="aria"
                {...props}
                onSubmit={(event) => {
                    // This form's submit lifecycle is fully owned by react-hook-form. Stop the native
                    // "submit" event here so it can't bubble past this form to ancestor listeners (e.g. a
                    // dev harness) that would otherwise treat a validation-blocked attempt as a real submit.
                    event.stopPropagation();
                    onSubmit?.(event);
                }}
            />
        </FormProvider>
    );
};

HookForm.displayName = "HookForm";

export const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    children,
    ...props
}: FormFieldProps<TFieldValues, TName>) => {
    const id = "form-item-" + useId();
    const control = useController(props);

    return (
        <FormFieldContext.Provider
            value={{
                id,
                name: props.name,
                control: control as UseControllerReturn<FieldValues, TName>,
            }}
        >
            {children && (typeof children === "function" ? children(control) : children)}
        </FormFieldContext.Provider>
    );
};

FormField.displayName = "FormField";
