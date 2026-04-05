import anxietyActive from "@/assets/survey/emotions/figma/anxiety-active-group.svg";
import anxietyDefault from "@/assets/survey/emotions/figma/anxiety-default-group.svg";
import confidentActive from "@/assets/survey/emotions/figma/confident-active-group.svg";
import confidentDefault from "@/assets/survey/emotions/figma/confident-default-group.svg";
import regretActive from "@/assets/survey/emotions/figma/regret-active-group.svg";
import regretDefault from "@/assets/survey/emotions/figma/regret-default-group.svg";
import rushActive from "@/assets/survey/emotions/figma/rush-active-group.svg";
import rushDefault from "@/assets/survey/emotions/figma/rush-default-group.svg";
import unknownActive from "@/assets/survey/emotions/figma/unknown-active-group.svg";
import unknownDefault from "@/assets/survey/emotions/figma/unknown-default-group.svg";

type EmotionLabel =
    | "확신해요"
    | "조급해요"
    | "불안해요"
    | "후회돼요"
    | "모르겠어요";

const emotionFaceAssets: Record<
    EmotionLabel,
    { active: string; default: string }
> = {
    "확신해요": {
        active: confidentActive,
        default: confidentDefault,
    },
    "조급해요": {
        active: rushActive,
        default: rushDefault,
    },
    "불안해요": {
        active: anxietyActive,
        default: anxietyDefault,
    },
    "후회돼요": {
        active: regretActive,
        default: regretDefault,
    },
    "모르겠어요": {
        active: unknownActive,
        default: unknownDefault,
    },
};

interface EmotionFaceIconProps {
    emotion: EmotionLabel;
    selected: boolean;
}

function EmotionFaceIcon({ emotion, selected }: EmotionFaceIconProps) {
    const asset = emotionFaceAssets[emotion];

    return (
        <img
            src={selected ? asset.active : asset.default}
            alt=""
            className="h-9 w-9 shrink-0"
        />
    );
}

export default EmotionFaceIcon;
