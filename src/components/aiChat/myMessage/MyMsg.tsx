function MyMsg({ message }: { message: string }) {
    return (
        <div className="w-full flex justify-end items-end gap-2">
            <div className="max-w-[72%] py-3 px-4 bg-stone-700 rounded-3xl rounded-br-md">
                <p className="text-white text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    );
}

export default MyMsg;
