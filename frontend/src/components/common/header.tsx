"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "../ui/sheet";
import ThemeToggle from "./theme-toggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex h-16 items-center justify-between px-4 md:px-10">
                {/* MobileNav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <Link
                                href="/"
                                className="flex items-center justify-center"
                            >
                                Survey
                            </Link>
                        </SheetHeader>

                        <SheetFooter>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                {/* MobileNav */}

                <div className="flex">
                    <Link
                        href="/"
                        className="flex items-center text-2xl font-bold"
                    >
                        Survey
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Button className="hidden md:flex" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
