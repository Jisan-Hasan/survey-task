"use client";

import ActionToggle from "@/components/common/action-toggle";
import { Badge } from "@/components/ui/badge";
import { AnyType } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, File } from "lucide-react";

export const surveyColumns: ColumnDef<AnyType>[] = [
    {
        header: "Serial",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>;
        },
        enableSorting: true,
        maxSize: 80,
    },
    {
        accessorKey: "title",
        header: "Title",
        enableColumnFilter: true,
    },
    {
        accessorKey: "is_active",
        header: "Active Status",
        maxSize: 100,
        cell: ({ row }: { row: { original: AnyType } }) => {
            return (
                <Badge
                    variant={
                        row?.original?.is_active ? "default" : "destructive"
                    }
                >
                    {row?.original?.is_active ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        header: "Actions",
        cell: ({ row }: { row: Row<AnyType> }) => {
            const data = row.original;
            const actions = [
                [
                    {
                        label: "Details",
                        icon: File,
                        href: `/admin/survey/${data.id}`,
                    },
                    {
                        label: "Edit",
                        icon: Edit,
                        href: `/admin/survey/${data.id}/edit`,
                    },
                ],
                [
                    {
                        label: "Responses",
                        icon: File,
                        href: `/admin/survey/${data.id}/responses`,
                    },
                ],
            ];
            return <ActionToggle actions={actions} />;
        },
    },
];
