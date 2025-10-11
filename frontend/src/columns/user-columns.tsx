"use client";

import ActionToggle from "@/components/common/action-toggle";
import { Badge } from "@/components/ui/badge";
import { AnyType } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit } from "lucide-react";

export const userColumns: ColumnDef<AnyType>[] = [
    {
        header: "Serial",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>;
        },
        enableSorting: true,
        maxSize: 80,
    },
    {
        accessorKey: "full_name",
        header: "Full Name",
        enableColumnFilter: true,
    },
    {
        accessorKey: "email",
        header: "Email",
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
            const user = row.original;
            const actions = [
                [{ label: "Edit", icon: Edit, href: `/admin/${user.id}/edit` }],
            ];
            return <ActionToggle actions={actions} />;
        },
    },
];
