"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50, 100],
}: PaginationProps) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range?.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots?.push(1, "...");
        } else {
            rangeWithDots?.push(1);
        }

        rangeWithDots?.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots?.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots?.push(totalPages);
        }

        return rangeWithDots;
    };

    //   if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between px-2 py-0">
            <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                    Showing {startItem} to {endItem} of {totalItems} entries
                </p>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={pageSize?.toString()}
                        onValueChange={(value) =>
                            onPageSizeChange(Number(value))
                        }
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions?.map((size) => (
                                <SelectItem key={size} value={size?.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                        {getVisiblePages().map((page, index) => (
                            <Button
                                key={index}
                                variant={
                                    page === currentPage ? "default" : "outline"
                                }
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    typeof page === "number" &&
                                    onPageChange(page)
                                }
                                disabled={typeof page !== "number"}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
