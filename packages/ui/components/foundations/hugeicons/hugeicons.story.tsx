import type { SVGProps } from "react";
import * as Hugeicons from "@/components/foundations/hugeicons";

export default {
    title: "Foundations/Hugeicons",
};

const icons = Object.entries(Hugeicons) as [string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element][];

export const Grid = () => (
    <div data-compare className="grid w-[960px] grid-cols-6 gap-2 bg-white p-4">
        {icons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-lg border border-secondary p-3 text-[#101419]">
                <div className="flex h-16 items-center justify-center">
                    <Icon />
                </div>
                <span className="text-center text-[10px] leading-3 break-all">{name}</span>
            </div>
        ))}
    </div>
);
