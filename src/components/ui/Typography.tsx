type TypographyProps = {
    children: string;
};

export function TypographyH1({ children }: TypographyProps) {
    return (
        <h1
            className="
                whitespace-pre-line
                text-left
                text-2xl
                font-bold
                leading-9
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
