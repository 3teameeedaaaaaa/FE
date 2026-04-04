function TitleTag({ children }: { children: string }) {
    return (
        <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {children}
        </div>
    );
}

export default TitleTag;
