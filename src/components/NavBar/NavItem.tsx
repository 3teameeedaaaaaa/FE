import { Link } from "react-router-dom";

import type { NavItemType } from "./nav.config";

interface NavItemProps {
    item: NavItemType;
    isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
    const iconSrc = isActive ? item.activeIcon : item.icon;
    const textColor = isActive ? "text-stone-900" : "text-stone-400";

    return (
        <Link
            to={item.path}
            className="flex flex-col items-center justify-center gap-1"
        >
            <img src={iconSrc} alt={item.label} className="w-6 h-6" />
            <span
                className={`
                    text-[10px] 
                    font-medium 
                    transition-colors 
                    ${textColor}
                `}
            >
                {item.label}
            </span>
        </Link>
    );
}

export default NavItem;
