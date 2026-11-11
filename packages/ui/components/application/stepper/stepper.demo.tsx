"use client";

import { useState } from "react";
import { Stepper } from "@/components/application/stepper/stepper";
import { Button } from "@/components/base/buttons/button";

const steps = [
    { id: "photo", label: "Take Photo" },
    { id: "details", label: "Details" },
    { id: "style", label: "Add Style" },
];

export const StepperDemo = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="flex flex-col items-center gap-6">
            <Stepper steps={steps} currentStep={step} onStepPress={setStep} onBack={() => setStep(Math.max(0, step - 1))} />
            <div className="flex gap-3">
                <Button color="secondary" size="sm" isDisabled={step === 0} onClick={() => setStep(step - 1)}>
                    Back
                </Button>
                <Button size="sm" isDisabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>
                    Continue
                </Button>
            </div>
        </div>
    );
};

/** The Figma desktop frame: first step current. */
export const StepperFigmaDemo = () => <Stepper steps={steps} currentStep={0} />;

/** The Figma mobile frame: last step current, with the back chevron (shown below `md`). */
export const StepperFigmaMobileDemo = () => (
    <Stepper
        steps={[
            { id: "photo", label: "Take Photo" },
            { id: "persona", label: "Persona" },
            { id: "style", label: "Add Style" },
        ]}
        currentStep={2}
        onBack={() => {}}
    />
);
