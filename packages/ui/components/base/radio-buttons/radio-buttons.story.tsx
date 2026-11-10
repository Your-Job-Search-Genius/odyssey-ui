import type { FC } from "react";
import { Button } from "@/components/base/buttons/button";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import * as Radio from "@/components/base/radio-buttons/radio-buttons.demo";

export default {
    title: "Base components/Radio buttons",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const RadioButtons = () => <Radio.RadioButtons />;
RadioButtons.storyName = "Radio buttons";

export const RadioButtonsBase = () => <Radio.RadioButtonsBase />;
RadioButtonsBase.storyName = "Radio buttons base";

export const RadioButtonsHorizontal = () => <Radio.HorizontalDemo />;
RadioButtonsHorizontal.storyName = "Radio buttons horizontal";

export const RadioButtonsInverse = () => <Radio.InverseDemo />;
RadioButtonsInverse.storyName = "Radio buttons on a dark surface (tone)";

const purposes = ["Personal Use", "Career Fair", "Networking Event", "Job Interview Workshop", "Resume Building Session"];

/** BetterShot P09: md radios in the white body of the dark selection dialog (the shell is group C's; plain divs here). */
export const FigmaDarkDialog = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <div className="flex w-[372px] flex-col gap-2.5 rounded-[17px] bg-inverse px-0.5 py-3">
            <h2 id="shot-purpose" className="px-3 text-[18px] leading-[normal] font-semibold text-white">
                What are you taking this shot for?
            </h2>
            <div className="rounded-[14px] bg-white p-[5px]">
                <RadioGroup aria-labelledby="shot-purpose" size="md" defaultValue={purposes[0]} className="gap-0">
                    {purposes.map((purpose) => (
                        <RadioButton
                            key={purpose}
                            value={purpose}
                            label={purpose}
                            className="px-2.5 py-3 not-first:mt-2.5 not-first:border-t not-first:border-tertiary not-first:pt-[21px]"
                        />
                    ))}
                </RadioGroup>
            </div>
            <div className="flex items-center justify-between px-3">
                <Button color="secondary">Cancel</Button>
                <Button color="primary">Continue</Button>
            </div>
        </div>
    </div>
);
