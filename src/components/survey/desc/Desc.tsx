function Desc({ children }: { children: string }) {
    return (
        <p className="mt-3 text-left font-serif text-sm leading-6 text-stone-500">
            {children}
        </p>
    );
}

export default Desc;
