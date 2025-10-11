import { MenuType } from "@/components/admin/sidebar";
import {
    DoorClosed,
    FileText,
    Home,
    SquareTerminal,
    Store,
} from "lucide-react";

export const menus: {
    title: string;
    menus: MenuType[];
}[] = [
    {
        title: "",
        menus: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: SquareTerminal,
                isActive: true,
            },
            {
                title: "Admin Management",
                icon: Home,
                isActive: false,
                subs: [
                    {
                        title: "Admin List",
                        url: "/admin/list",
                        icon: Store,
                        isActive: false,
                    },
                    {
                        title: "Create Admin",
                        url: "/admin/create",
                        icon: DoorClosed,
                        isActive: false,
                    },
                ],
            },
            {
                title: "Survey Management",
                icon: FileText,
                isActive: false,
                subs: [
                    {
                        title: "Survey List",
                        url: "/admin/survey/list",
                        icon: Store,
                        isActive: false,
                    },
                    {
                        title: "Create Survey",
                        url: "/admin/survey/create",
                        icon: DoorClosed,
                        isActive: false,
                    },
                ],
            },
        ],
    },
];
