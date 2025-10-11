"use client";

import { ArrowLeftRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function SidebarToggle() {
    const { toggleSidebar, setOpenMobile } = useSidebar();
    const pathname = usePathname();

    useEffect(() => {
        setOpenMobile(false);
    }, [pathname, setOpenMobile]);

    return (
        <Button
            data-sidebar="trigger"
            variant="outline"
            size="icon"
            className=""
            onClick={toggleSidebar}
        >
            <ArrowLeftRight />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}
