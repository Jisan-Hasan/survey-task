"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

type ActionType = {
    label: string;
    icon?: React.ElementType;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function ActionToggle({ actions }: { actions: ActionType[][] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action: ActionType[], index: number) => (
                    <React.Fragment key={index}>
                        {action.map((item: ActionType, indexItem: number) => (
                            <React.Fragment key={indexItem}>
                                {item?.href && (
                                    <DropdownMenuItem disabled={item?.disabled}>
                                        <Link
                                            href={
                                                item.disabled ? "#" : item.href
                                            }
                                            className={`flex items-center gap-2 w-full ${
                                                item?.disabled
                                                    ? "cursor-not-allowed pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }`}
                                            onClick={
                                                item.disabled
                                                    ? (e) => e.preventDefault()
                                                    : undefined
                                            }
                                        >
                                            {item?.icon && (
                                                <item.icon className="h-4 w-4" />
                                            )}
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {item?.onClick && (
                                    <DropdownMenuItem disabled={item?.disabled}>
                                        <div
                                            onClick={
                                                item.disabled
                                                    ? undefined
                                                    : () =>
                                                          item.onClick &&
                                                          item.onClick()
                                            }
                                            className={`flex items-center gap-2 w-full ${
                                                item?.disabled
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            {item?.icon && (
                                                <item.icon className="h-4 w-4" />
                                            )}
                                            {item.label}
                                        </div>
                                    </DropdownMenuItem>
                                )}
                            </React.Fragment>
                        ))}
                        {index !== actions.length - 1 && (
                            <DropdownMenuSeparator />
                        )}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
