import { SendHorizonal } from "lucide-react";

type ComposerFooterProps = {
    type: "composer";
    value: string;
    placeholder: string;
    disabled?: boolean;
    secondaryActionLabel?: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onSecondaryAction?: () => void;
};

type ChoiceFooterProps = {
    type: "choices";
    title?: string;
    description?: string;
    choices: string[];
    onSelect: (index: number, label: string) => void;
};

type CtaFooterProps = {
    type: "cta";
    title?: string;
    description?: string;
    label: string;
    onClick: () => void;
};

type LocalChatFooterProps =
    | ComposerFooterProps
    | ChoiceFooterProps
    | CtaFooterProps;

function LocalChatFooter(props: LocalChatFooterProps) {
    if (props.type === "composer") {
        const isSubmitDisabled = props.disabled || !props.value.trim();

        return (
            <footer className="shrink-0 space-y-3 border-t border-stone-200 bg-white px-5 pb-5 pt-4">
                <div
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                        props.disabled
                            ? "border-stone-200 bg-stone-100"
                            : "border-stone-200 bg-stone-50"
                    }`}
                >
                    <textarea
                        value={props.value}
                        onChange={(event) => props.onChange(event.target.value)}
                        onKeyDown={(event) => {
                            // 단독 Enter는 전송, Shift+Enter는 줄바꿈으로 유지한다.
                            if (event.key !== "Enter" || event.shiftKey) {
                                return;
                            }

                            event.preventDefault();

                            if (!isSubmitDisabled) {
                                props.onSubmit();
                            }
                        }}
                        placeholder={props.placeholder}
                        rows={1}
                        disabled={props.disabled}
                        className={`field-sizing-content max-h-24 min-h-[22px] min-w-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-5 shadow-none outline-none placeholder:text-stone-400 ${
                            props.disabled
                                ? "cursor-not-allowed text-stone-400"
                                : "text-stone-800"
                        }`}
                    />

                    <button
                        type="button"
                        onClick={props.onSubmit}
                        disabled={isSubmitDisabled}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isSubmitDisabled
                                ? "bg-stone-300 text-white"
                                : "bg-stone-800 text-white hover:bg-stone-900"
                        }`}
                    >
                        <SendHorizonal className="h-4 w-4" />
                    </button>
                </div>

                {props.secondaryActionLabel ? (
                    <button
                        type="button"
                        onClick={props.onSecondaryAction}
                        className="w-full text-center text-sm text-stone-400 transition-colors hover:text-stone-600"
                    >
                        {props.secondaryActionLabel}
                    </button>
                ) : null}
            </footer>
        );
    }

    if (props.type === "cta") {
        return (
            <footer className="shrink-0 space-y-3 border-t border-stone-200 bg-white px-5 pb-5 pt-4">
                {props.title || props.description ? (
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                        {props.title ? (
                            <p className="text-sm font-semibold text-stone-900">
                                {props.title}
                            </p>
                        ) : null}
                        {props.description ? (
                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                {props.description}
                            </p>
                        ) : null}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={props.onClick}
                    className="h-12 w-full rounded-2xl bg-stone-900 text-white transition-colors hover:bg-stone-800"
                >
                    {props.label}
                </button>
            </footer>
        );
    }

    return (
        <footer className="shrink-0 space-y-2 border-t border-stone-200 bg-white px-5 pb-5 pt-4">
            {props.title || props.description ? (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                    {props.title ? (
                        <p className="text-sm font-semibold text-stone-900">
                            {props.title}
                        </p>
                    ) : null}
                    {props.description ? (
                        <p className="mt-1 text-xs leading-5 text-stone-500">
                            {props.description}
                        </p>
                    ) : null}
                </div>
            ) : null}

            {props.choices.map((choice, index) => (
                <button
                    key={choice}
                    type="button"
                    onClick={() => props.onSelect(index, choice)}
                    className="h-auto w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-center text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                >
                    {choice}
                </button>
            ))}
        </footer>
    );
}

export default LocalChatFooter;
