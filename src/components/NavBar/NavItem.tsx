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
            className="flex w-16 flex-col items-center justify-center gap-1.5"
        >
            <img src={iconSrc} alt={item.label} className="h-6 w-6" />
            <span
                className={`text-xs font-medium leading-4 transition-colors ${textColor}`}
            >
                {item.label}
            </span>
        </Link>
    );
}

export default NavItem;
