import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoginInputProps {
    id: string;
    placeholder: string;
    label: string;
    icon?: string;
    iconComponent?: LucideIcon;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    hideLabel?: boolean;
    wrapperClassName?: string;
    inputClassName?: string;
    iconClassName?: string;
}

function LoginInput({
    id,
    placeholder,
    label,
    icon,
    iconComponent: IconComponent,
    type = "text",
    value,
    onChange,
    autoComplete,
    hideLabel = false,
    wrapperClassName,
    inputClassName,
    iconClassName,
}: LoginInputProps) {
    return (
        <label htmlFor={id} className="block space-y-2">
            <span
                className={cn(
                    "text-sm font-medium text-stone-700",
                    hideLabel && "sr-only",
                )}
            >
                {label}
            </span>
            <div
                className={cn(
                    "flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3",
                    wrapperClassName,
                )}
            >
                {IconComponent ? (
                    <IconComponent
                        aria-hidden="true"
                        className={cn("h-5 w-5 shrink-0", iconClassName)}
                        strokeWidth={1.8}
                    />
                ) : icon ? (
                    <img src={icon} alt="" className="h-6 w-6" />
                ) : null}
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    className={cn(
                        "w-full border-0 bg-transparent p-0 text-sm text-stone-900 shadow-none outline-none ring-0 placeholder:text-stone-400 focus-visible:ring-0",
                        inputClassName,
                    )}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </label>
    );
}

export default LoginInput;
