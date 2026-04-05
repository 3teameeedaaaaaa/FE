import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HomeSectionCardProps extends PropsWithChildren {
    title: string;
    description: string;
    titleTone?: string;
    headerExtra?: ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    descriptionClassName?: string;
}

function HomeSectionCard({
    title,
    description,
    titleTone = "text-[#314158]",
    headerExtra,
    className,
    headerClassName,
    contentClassName = "mt-5",
    descriptionClassName = "text-base leading-6 text-stone-500",
    children,
}: HomeSectionCardProps) {
    return (
        <section
            className={cn(
                "rounded-[24px] border border-stone-200 bg-white px-5 py-5 text-left",
                className,
            )}
        >
            <div className={cn("space-y-3", headerClassName)}>
                <div className="space-y-0.5 text-left">
                    <p className={cn("text-sm leading-5 font-bold", titleTone)}>
                        {title}
                    </p>
                    <p className={descriptionClassName}>{description}</p>
                </div>
                {headerExtra}
            </div>
            <div className={contentClassName}>{children}</div>
        </section>
    );
}

export default HomeSectionCard;
