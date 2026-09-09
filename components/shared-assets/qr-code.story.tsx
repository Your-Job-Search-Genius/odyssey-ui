import type { FC } from "react";
import * as QRCodeDemos from "@/components/shared-assets/qr-code.demo";

export default {
    title: "Shared Assets/Miscellaneous assets/QR code",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <QRCodeDemos.BasicDemo />;

export const Large = () => <QRCodeDemos.LargeDemo />;
