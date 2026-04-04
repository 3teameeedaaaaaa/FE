function Desc({ children }: { children: string }) {
    return (
        <p className="mt-2 font-serif text-sm leading-6 text-stone-500">
            {children}
        </p>
    );
}

export default Desc;
