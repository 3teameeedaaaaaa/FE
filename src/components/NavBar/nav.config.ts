import activeHomeIcon from "../../assets/navBar/active-home.svg";
import activeMessageIcon from "../../assets/navBar/active-message.svg";
import activeRecordIcon from "../../assets/navBar/active-record.svg";
import homeIcon from "../../assets/navBar/home.svg";
import messageIcon from "../../assets/navBar/message.svg";
import recordIcon from "../../assets/navBar/record.svg";

export type NavItemType = {
    path: string;
    icon: string;
    activeIcon: string;
    label: string;
};

export const NAV_ITEMS: NavItemType[] = [
    {
        path: "/",
        icon: homeIcon,
        activeIcon: activeHomeIcon,
        label: "홈",
    },
    {
        path: "/chat",
        icon: messageIcon,
        activeIcon: activeMessageIcon,
        label: "대화하기",
    },
    {
        path: "/",
        icon: recordIcon,
        activeIcon: activeRecordIcon,
        label: "내 기록",
    },
];
