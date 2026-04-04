function AiMsg({ message }: { message: string }) {
    return (
        <div className="w-full flex justify-start items-end gap-2">
            {/* AI 아바타 */}
            <div className="w-8 h-8 shrink-0 rounded-full bg-violet-200 flex justify-center items-center text-violet-700 font-bold text-sm">
                AI
            </div>
            <div className="max-w-[72%] py-3 px-4 bg-white rounded-3xl rounded-bl-md border border-stone-200 shadow-sm">
                <p className="text-stone-800 text-sm leading-relaxed">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default AiMsg;
