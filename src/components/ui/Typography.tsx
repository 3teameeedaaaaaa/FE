type TypographyProps = {
    children: string;
};

export function TypographyH1({ children }: TypographyProps) {
    return (
        <h1
            className="
                text-[1.75rem] 
                font-semibold 
                tracking-tight 
                text-stone-950
            "
        >
            {children}
        </h1>
    );
}

export function TypographyH2({ children }: TypographyProps) {
    return (
        <h2
            className="
                text-lg 
                font-semibold 
                text-stone-950
            "
        >
            {children}
        </h2>
    );
}
