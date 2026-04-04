interface LoginInputProps {
    id: string;
    placeholder: string;
    label: string;
    icon: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LoginInput({
    id,
    placeholder,
    label,
    icon,
    value,
    onChange,
}: LoginInputProps) {
    return (
        <label htmlFor={id} className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">{label}</span>
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3">
                <img src={icon} alt="" className="h-6 w-6" />
                <input
                    id={id}
                    type={id}
                    className="
                        w-full 
                        border-0 
                        bg-transparent 
                        p-0 
                        text-sm 
                        text-stone-900 
                        shadow-none 
                        outline-none 
                        ring-0 
                        placeholder:text-stone-400 
                        focus-visible:ring-0"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </label>
    );
}

export default LoginInput;
