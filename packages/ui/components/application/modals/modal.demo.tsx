"use client";

import { type ReactNode, useState } from "react";
import { Button as AriaButton, Heading as AriaHeading, ToggleButton as AriaToggleButton } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { ArrowRight02SharpIcon, CheckmarkCircle02Icon, FileUploadIcon, UserIcon } from "@/components/foundations/hugeicons";
import { AlertTriangle, CheckCircle, Trash01 } from "@/components/foundations/icons";
import { FractalGlass } from "./fractal-glass";
import { Dialog, DialogTrigger, Modal, ModalBody, ModalFooter, ModalHeader, ModalOption, ModalOptionList, ModalOverlay } from "./modal";

/** Demos below take `defaultOpen` so stories can render them open for screenshots. */
interface OpenProps {
    defaultOpen?: boolean;
}

export const BasicModalDemo = () => {
    return (
        <DialogTrigger>
            <Button size="md">Open modal</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog>
                        {({ close }) => (
                            <>
                                <ModalHeader title="Update account" description="Make changes to your account details below." onClose={close} />
                                <ModalBody>
                                    <p>
                                        This is a standard modal built from the <code>Modal</code>, <code>Dialog</code>, <code>ModalHeader</code>,{" "}
                                        <code>ModalBody</code>, and <code>ModalFooter</code> primitives. It traps focus, locks background scroll, and dismisses
                                        on <kbd>Esc</kbd> or an outside click.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={close}>
                                        Save changes
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const ConfirmationModalDemo = () => {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DialogTrigger>
            <Button size="md" color="secondary-destructive" iconLeading={Trash01}>
                Delete account
            </Button>
            <ModalOverlay isDismissable={!isDeleting}>
                <Modal size="sm">
                    <Dialog role="alertdialog">
                        {({ close }) => (
                            <>
                                <ModalHeader
                                    icon={AlertTriangle}
                                    iconColor="error"
                                    title="Delete account"
                                    description="Are you sure you want to delete your account? This action cannot be undone."
                                    onClose={close}
                                />
                                <ModalFooter>
                                    <Button color="secondary" isDisabled={isDeleting} onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary-destructive"
                                        isLoading={isDeleting}
                                        onPress={() => {
                                            setIsDeleting(true);
                                            // Simulate an async delete request before dismissing.
                                            window.setTimeout(() => {
                                                setIsDeleting(false);
                                                close();
                                            }, 1200);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const SuccessModalDemo = () => {
    return (
        <DialogTrigger>
            <Button size="md">Complete payment</Button>
            <ModalOverlay>
                <Modal size="sm">
                    <Dialog>
                        {({ close }) => (
                            <>
                                <ModalHeader
                                    icon={CheckCircle}
                                    iconColor="success"
                                    title="Payment successful"
                                    description="Your payment has been processed. A receipt has been sent to your email."
                                    onClose={close}
                                />
                                <ModalFooter>
                                    <Button color="primary" onPress={close}>
                                        Done
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const SizesModalDemo = () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
                <DialogTrigger key={size}>
                    <Button size="md" color="secondary">
                        {size.toUpperCase()}
                    </Button>
                    <ModalOverlay>
                        <Modal size={size}>
                            <Dialog>
                                {({ close }) => (
                                    <>
                                        <ModalHeader
                                            title={`Size: "${size}"`}
                                            description="Resize the viewport to see how each size behaves on mobile."
                                            onClose={close}
                                        />
                                        <ModalBody>
                                            <p>This dialog panel is constrained to the {size} max-width breakpoint on `sm` and larger screens.</p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="secondary" onPress={close}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </Dialog>
                        </Modal>
                    </ModalOverlay>
                </DialogTrigger>
            ))}
        </div>
    );
};

const purposes = ["Personal Use", "Career Fair", "Networking Event", "Job Interview Workshop", "Resume Building Session"];

/** P09: dark selection dialog with a radio list. */
export const SelectionDialogDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">New shoot</Button>
        <ModalOverlay>
            <Modal variant="dark-inset" className="sm:max-w-93">
                <Dialog>
                    {({ close }) => (
                        <>
                            <ModalHeader title="What are you taking this shot for?" showCloseButton={false} />
                            <ModalBody>
                                <RadioGroup aria-label="Shot purpose" size="md" defaultValue={purposes[0]} className="gap-5">
                                    {purposes.map((purpose) => (
                                        <RadioButton
                                            key={purpose}
                                            value={purpose}
                                            label={purpose}
                                            // 48px rows with a divider centred in the 20px gap between them.
                                            className="px-2.5 py-3 not-first:before:absolute not-first:before:inset-x-0 not-first:before:-top-2.5 not-first:before:border-t not-first:before:border-tertiary"
                                        />
                                    ))}
                                </RadioGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button size="md" color="secondary" onPress={close}>
                                    Cancel
                                </Button>
                                <Button size="md" onPress={close}>
                                    Continue
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P09: dark selection dialog with "List Default" icon rows. */
export const SelectionListDialogDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Restart shoot</Button>
        <ModalOverlay>
            <Modal variant="dark-inset" className="sm:max-w-93">
                <Dialog>
                    {({ close }) => (
                        <>
                            <ModalHeader title="Is there anything you don’t like about the current result" showCloseButton={false} />
                            <ModalBody>
                                <ModalOptionList aria-label="What to change" selectionMode="multiple">
                                    <ModalOption
                                        id="selfies"
                                        icon={FileUploadIcon}
                                        title="Selfies"
                                        description="The quality of each selfie helps us generate quality headshots"
                                    />
                                    <ModalOption id="persona" icon={FileUploadIcon} title="Persona" description="Change your eye, hair preferences." />
                                    <ModalOption id="looks" icon={FileUploadIcon} title="Background/Outfits" description="Change the outfit or background" />
                                </ModalOptionList>
                            </ModalBody>
                            <ModalFooter>
                                <Button size="md" color="secondary" onPress={close}>
                                    Cancel
                                </Button>
                                <Button size="md" onPress={close}>
                                    Continue
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** "Take Selfie" label pill and the white close button that sit on top of the camera-flow modals. */
const CameraChrome = ({ label }: { label: string }) => (
    <>
        <span className="absolute top-5 left-1/2 -translate-x-1/2 rounded-[15px] bg-black/32 px-2.5 py-[5px] text-sm/[normal] font-medium whitespace-nowrap text-white">
            {label}
        </span>
        <CloseButton theme="white" className="absolute top-[21px] right-[19px]" />
    </>
);

const tips = [
    { title: "Soft, even Light", description: "Face a window; avoid strong backlight." },
    { title: "Clear Face", description: "Eyes visible, sharp focus, head and shoulders." },
    { title: "A Little Variety", description: "Mix straight-on and slight side angles." },
];

/** P11: "What makes a good photo?" guidance, on the dark camera shell. */
export const GuidanceModalDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="sm" color="outline-pill">
            What makes a good photo
        </Button>
        <ModalOverlay>
            <Modal variant="dark" className="sm:max-w-[362px]">
                <Dialog className="items-center pt-[89px] pb-3.5">
                    {({ close }) => (
                        <>
                            <CameraChrome label="Take Selfie" />

                            {/* Illustration: dotted halo, face-scan brackets, a person and a check. */}
                            <div aria-hidden="true" className="relative size-20">
                                <div className="absolute -top-16 left-1/2 size-[250px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0.75px,transparent_1px)] mask-[radial-gradient(closest-side,black_55%,transparent)] bg-size-[15px_15px] bg-position-[5px_5px]" />
                                <div className="absolute inset-0 rounded-[26px] border-[7.6px] border-[#00D76E] mask-[linear-gradient(to_right,black_29px,transparent_29px,transparent_51px,black_51px),linear-gradient(to_bottom,black_29px,transparent_29px,transparent_51px,black_51px)] mask-intersect" />
                                <UserIcon className="absolute top-[9px] left-1/2 size-[62px] -translate-x-1/2 text-white/35" />
                                <CheckmarkCircle02Icon className="absolute top-[49px] left-1/2 size-6 -translate-x-1/2 text-white" />
                            </div>

                            <AriaHeading slot="title" className="mt-[33px] w-[166px] text-center text-xl/[normal] font-semibold text-white">
                                What makes a good photo?
                            </AriaHeading>

                            <ul className="mt-8 flex w-[335px] max-w-full flex-col gap-[11px]">
                                {tips.map((tip) => (
                                    <li
                                        key={tip.title}
                                        className="flex h-[74px] flex-col justify-center gap-0.5 rounded-[14px] bg-white/10 p-3 text-sm/[normal]"
                                    >
                                        <span className="text-md/[normal] font-semibold text-white">{tip.title}</span>
                                        {/* Figma #AEB1B9 is 3.4:1 on the tip row; text-popover (#CCCDCF) passes AA. */}
                                        <span className="text-popover">{tip.description}</span>
                                    </li>
                                ))}
                            </ul>

                            <AriaButton
                                onPress={close}
                                className="mt-[27px] flex cursor-pointer flex-col items-center gap-[5px] rounded-lg text-[13px]/[1.6] font-medium text-white outline-white focus-visible:outline-2 focus-visible:outline-offset-4"
                            >
                                <span className="flex size-[70px] items-center justify-center rounded-full border-4 border-brand-200 p-[3px]">
                                    <span className="flex size-full items-center justify-center rounded-full bg-white">
                                        <ArrowRight02SharpIcon aria-hidden="true" className="size-9 text-[#141B34]" />
                                    </span>
                                </span>
                                Take a Photo
                            </AriaButton>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** Grey stand-in for content another component draws (photo slots, model cards, the camera view...). */
const Placeholder = ({ className, children }: { className?: string; children?: ReactNode }) => (
    <div
        className={`flex items-center justify-center rounded-[20px] border-2 border-dashed border-[#5E5E5E] text-xs text-inverse-secondary ${className ?? ""}`}
    >
        {children}
    </div>
);

/** P20: white browse-all modal, CTA in the header. */
export const BrowseAllModalDemo = ({ defaultOpen }: OpenProps) => {
    const [selected, setSelected] = useState(1);

    return (
        <DialogTrigger defaultOpen={defaultOpen}>
            <Button size="md" color="secondary">
                See more options
            </Button>
            <ModalOverlay>
                <Modal className="sm:max-w-214">
                    <Dialog>
                        {({ close }) => (
                            <>
                                <ModalHeader
                                    showCloseButton={false}
                                    title={
                                        <span className="flex items-center gap-[3px]">
                                            Style
                                            <span className="rounded-[5px] bg-brand-primary px-1 py-0.5 text-[13px]/[normal] font-medium text-brand-secondary">
                                                Taper Fade
                                            </span>
                                        </span>
                                    }
                                    actions={
                                        <Button size="lg" onPress={close}>
                                            Continue
                                        </Button>
                                    }
                                />
                                <ModalBody className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <AriaToggleButton
                                            key={i}
                                            isSelected={selected === i}
                                            onChange={() => setSelected(i)}
                                            className="relative flex h-[255px] cursor-pointer flex-col justify-end rounded-[20px] border-2 border-[#F2F2F2] px-[7px] pb-[9px] outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 selected:border-brand-600"
                                        >
                                            <span className="w-fit rounded-md bg-[#F0F0F0] px-[5px] py-0.5 text-md/[normal] font-semibold text-black">
                                                {selected === i ? "Taper Fade" : "Style 4"}
                                            </span>
                                            {selected === i && (
                                                <CheckmarkCircle02Icon
                                                    aria-hidden="true"
                                                    className="absolute right-1.5 bottom-[9px] size-6 text-fg-brand-primary"
                                                />
                                            )}
                                        </AriaToggleButton>
                                    ))}
                                </ModalBody>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

/** P36: splash / licence modal with the fractal-glass hero. */
export const SplashModalDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Open splash</Button>
        <ModalOverlay backdrop="splash">
            <Modal className="rounded-[20px] sm:max-w-[475px]">
                <Dialog className="pt-[438px]">
                    {({ close }) => (
                        <>
                            <FractalGlass />
                            <CloseButton theme="white" className="absolute top-3.5 right-3.5" />
                            <div className="relative flex flex-col items-start gap-[17px] px-6 pb-7">
                                <div className="flex flex-col gap-2">
                                    {/* Stand-in for the product logo image (132x21). */}
                                    <span className="h-[21px] text-lg/[21px] font-semibold text-primary">Bettershot</span>
                                    <AriaHeading slot="title" className="text-[26px]/[normal] font-semibold text-primary">
                                        Over 3 million are generating headshots with BetterShot.
                                    </AriaHeading>
                                </div>
                                <Button size="sm" iconTrailing={ArrowRight02SharpIcon} className="py-2" onPress={close}>
                                    Create my Headshot
                                </Button>
                            </div>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P10 shell: dark camera modal, full screen on phones; the face guide and shutter are placeholders. */
export const CameraModalShellDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Take selfie</Button>
        <ModalOverlay mobileLayout="fullscreen">
            <Modal variant="dark" className="sm:max-w-[362px]">
                <Dialog className="h-[667px] items-center gap-4 px-4 pt-[72px] pb-[max(1rem,env(safe-area-inset-bottom))] max-md:h-full">
                    <CameraChrome label="Take Selfie" />
                    <div className="flex w-[282px] flex-col gap-1 text-center">
                        <AriaHeading slot="title" className="text-xl/[normal] font-semibold text-white">
                            Look straight at the camera
                        </AriaHeading>
                        <p className="text-sm/[normal] text-inverse-tertiary">Keep your head still and look directly ahead.</p>
                    </div>
                    <Placeholder className="w-full flex-1">Face guide + shutter</Placeholder>
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P14 shell: dark add-photo modal; the slot grid is a placeholder. */
export const PhotoSlotModalShellDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Add photo</Button>
        <ModalOverlay backdrop="dark">
            <Modal variant="dark" className="rounded-[20px] sm:max-w-[647px]">
                <Dialog>
                    <ModalHeader
                        title="Add Photo"
                        description="Select the closest match. Same clothes, different person."
                        showCloseButton={false}
                        actions={
                            <Button size="md" color="white" isDisabled>
                                Continue 1/5
                            </Button>
                        }
                    />
                    <ModalBody className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Placeholder key={i} className="h-[261px]">
                                Photo slot
                            </Placeholder>
                        ))}
                    </ModalBody>
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P16 shell: translucent crop modal; the image, toolbar and thumb strip are placeholders. */
export const CropModalShellDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Crop</Button>
        <ModalOverlay>
            <Modal variant="translucent" className="sm:max-w-[750px]">
                <Dialog>
                    <ModalHeader
                        title="Crop your Face"
                        showCloseButton={false}
                        actions={
                            <Button size="md" color="white" isDisabled>
                                Continue 1/5
                            </Button>
                        }
                    />
                    <ModalBody className="h-[441px] p-0">
                        <Placeholder className="size-full rounded-none">Crop area + toolbar</Placeholder>
                    </ModalBody>
                    {/* Thumb strip area. */}
                    <div className="h-[109px]" />
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P22 shell: dark model picker; the model cards are placeholders. */
export const ModelPickerModalShellDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Change model</Button>
        <ModalOverlay backdrop="dark">
            <Modal variant="dark" className="sm:max-w-214">
                <Dialog>
                    {({ close }) => (
                        <>
                            <ModalHeader
                                title="Choose Model for Outfit Try-ons"
                                description="Select the closest match. Same clothes, different person."
                                showCloseButton={false}
                            />
                            <ModalBody className="grid grid-cols-4 gap-3">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <Placeholder key={i} className="h-[261px] border-solid bg-[#545454]">
                                        Model card
                                    </Placeholder>
                                ))}
                            </ModalBody>
                            <ModalFooter className="pt-0">
                                <Button size="md" color="white" onPress={close}>
                                    Continue to Styling
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

/** P27 shell: dark background picker; the tile grid and preview are placeholders. */
export const BackgroundPickerModalShellDemo = ({ defaultOpen }: OpenProps) => (
    <DialogTrigger defaultOpen={defaultOpen}>
        <Button size="md">Change background</Button>
        <ModalOverlay backdrop="dark">
            <Modal variant="dark" className="sm:max-w-214">
                <Dialog>
                    <ModalHeader title="Select Background" description="Same outfit. Tap a different room to swap this look." showCloseButton={false} />
                    <ModalBody className="flex-row gap-[9px]">
                        <div className="h-[534px] w-[265px] shrink-0 rounded-[20px] bg-white/7 p-3">
                            <Placeholder className="size-full">Background tiles</Placeholder>
                        </div>
                        <div className="h-[534px] flex-1 rounded-[20px] bg-white/7 p-3">
                            <Placeholder className="size-full">Preview</Placeholder>
                        </div>
                    </ModalBody>
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);
