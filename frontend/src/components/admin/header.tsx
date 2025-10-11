import ThemeToggle from "../common/theme-toggle";
import UserToggle from "../common/user-toggle";
import LogoComponent from "./logo-component";
import SidebarToggle from "./sidebar-toggle";

export default async function Header() {
    return (
        <header className="sticky flex gap-2 shrink-0 items-center justify-between h-16 px-4 border-b">
            <div className="flex gap-4 items-center">
                <SidebarToggle />
                <LogoComponent width={60} className="md:hidden" />
            </div>
            <div className="flex gap-2">
                <ThemeToggle />
                <UserToggle />
            </div>
        </header>
    );
}
