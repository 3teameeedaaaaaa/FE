import backIcon from "@/assets/back-ico.webp";

type BackButtonProps = {
    onClick: () => void;
};

function BackButton({ onClick }: BackButtonProps) {
    return (
        <button
            type="button"
            className="w-10 h-10 rounded-full border-stone-200 bg-white text-stone-700 hover:bg-white"
            onClick={onClick}
        >
            <img src={backIcon} alt="back-icon" className="w-4 h-4" />
        </button>
    );
}

export default BackButton;
