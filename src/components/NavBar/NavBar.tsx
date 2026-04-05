import { useLocation } from "react-router-dom";

import { NAV_ITEMS } from "./nav.config";
import NavItem from "./NavItem";

function NavBar() {
    const location = useLocation();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40">
            <div className="mx-auto flex h-[90px] w-full max-w-[390px] items-start justify-between border-t border-stone-200 bg-white px-6 pb-[34px] pt-3">
                {NAV_ITEMS.map((item, index) => {
                    const isActive =
                        item.label === "홈"
                            ? location.pathname === "/"
                            : item.label === "대화하기"
                              ? location.pathname.startsWith("/chat")
                              : location.pathname.startsWith("/records");
                    return (
                        <NavItem key={index} item={item} isActive={isActive} />
                    );
                })}
            </div>
        </nav>
    );
}

export default NavBar;
