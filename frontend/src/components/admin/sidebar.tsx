"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { menus } from "@/lib/menus";
import { isPathActive } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface IconProps {
    icon: React.ElementType;
}

export interface MenuType {
    title: string;
    url?: string;
    icon?: IconProps["icon"];
    isActive?: boolean;
    subs?: MenuType[];
}

export default function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex justify-center">
                        <div>Survey</div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {menus?.map((group, index) => {
                    return (
                        <SidebarGroup key={index}>
                            {group?.title && (
                                <SidebarGroupLabel>
                                    {group?.title}
                                </SidebarGroupLabel>
                            )}

                            <SidebarMenu className="space-y-2">
                                {group?.menus?.map((menu: MenuType) => (
                                    <React.Fragment key={menu?.title}>
                                        {menu?.subs?.length ? (
                                            <Collapsible
                                                asChild
                                                defaultOpen={menu?.isActive}
                                                className="group/collapsible"
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        {menu?.url ? (
                                                            <SidebarMenuButton
                                                                asChild
                                                                tooltip={
                                                                    menu?.title
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        menu?.url
                                                                    }
                                                                >
                                                                    {menu?.icon && (
                                                                        <menu.icon />
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            menu?.title
                                                                        }
                                                                    </span>
                                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        ) : (
                                                            // check if the user has permission to view this menu
                                                            <SidebarMenuButton
                                                                tooltip={
                                                                    menu?.title
                                                                }
                                                                isActive={
                                                                    menu?.isActive
                                                                }
                                                            >
                                                                <>
                                                                    {menu?.icon && (
                                                                        <menu.icon />
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            menu?.title
                                                                        }
                                                                    </span>
                                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                                </>
                                                            </SidebarMenuButton>
                                                        )}
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {menu?.subs?.map(
                                                                (
                                                                    sub: MenuType
                                                                ) => (
                                                                    <SidebarMenuSubItem
                                                                        key={
                                                                            sub?.title
                                                                        }
                                                                    >
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={isPathActive(
                                                                                pathname,
                                                                                sub?.url ||
                                                                                    "#"
                                                                            )}
                                                                            className={
                                                                                isPathActive(
                                                                                    pathname,
                                                                                    sub?.url ||
                                                                                        "#"
                                                                                )
                                                                                    ? "bg-primary text-sidebar-accent-foreground"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    sub?.url ||
                                                                                    "#"
                                                                                }
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        sub?.title
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                )
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuItem>
                                                {
                                                    // Check if the user has permission to view this menu
                                                    <SidebarMenuButton
                                                        isActive={isPathActive(
                                                            pathname,
                                                            menu?.url || "#"
                                                        )}
                                                        className={
                                                            isPathActive(
                                                                pathname,
                                                                menu?.url || "#"
                                                            )
                                                                ? "bg-primary text-sidebar-accent-foreground"
                                                                : ""
                                                        }
                                                        asChild
                                                        tooltip={menu?.title}
                                                    >
                                                        <Link
                                                            href={
                                                                menu?.url || "#"
                                                            }
                                                        >
                                                            {menu?.icon && (
                                                                <menu.icon />
                                                            )}
                                                            <span>
                                                                {menu?.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                }
                                            </SidebarMenuItem>
                                        )}
                                    </React.Fragment>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>
        </Sidebar>
    );
}
