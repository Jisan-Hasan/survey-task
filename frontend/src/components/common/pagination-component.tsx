"use client";

import { ChevronLeftIcon, ChevronRightIcon, Ellipsis } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type PaginationProps = {
    table: {
        nextPage: () => void;
        previousPage: () => void;
        getCanNextPage: () => boolean;
        getCanPreviousPage: () => boolean;
    };
};

export default function PaginationComponent({ table }: PaginationProps) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className="flex w-full items-center justify-end py-2 mx-auto"
        >
            <ul className="flex flex-row items-center gap-1">
                <li>
                    <Button
                        aria-label="Go to previous page"
                        className="gap-1 pl-2.5"
                        variant="ghost"
                        size="default"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                </li>
                <li>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#">
                            <span>1</span>
                        </Link>
                    </Button>
                </li>
                <li>
                    <span
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center"
                    >
                        <Ellipsis className="h-4 w-4" />
                        <span className="sr-only">More pages</span>
                    </span>
                </li>
                <li>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#">
                            <span>2</span>
                        </Link>
                    </Button>
                </li>
                <li>
                    <Button
                        aria-label="Go to next page"
                        className="gap-1 pr-2.5"
                        variant="ghost"
                        size="default"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span>Next</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </li>
            </ul>
        </nav>
    );
}
