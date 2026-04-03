import { useLocation } from "react-router-dom";

import { NAV_ITEMS } from "./nav.config";
import NavItem from "./NavItem";

function NavBar() {
    const location = useLocation();

    return (
        <nav className=" h-16 fixed bottom-0 w-full max-w-md">
            <div className="w-full h-full flex flex items-center justify-between px-6">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavItem key={index} item={item} isActive={isActive} />
                    );
                })}
            </div>
        </nav>
    );
}

export default NavBar;
