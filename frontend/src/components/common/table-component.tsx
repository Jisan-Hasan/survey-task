"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GetQuery } from "@/lib/queries";
import { EndpointType } from "@/lib/types";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import TableSkeleton from "../skeleton/table-skeleton";
import PaginationComponent from "./pagination-component";

export function TableInstance<TData, TValue>({
    columns,
    data,
    isLoading,
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <Table className="border-b">
                <TableHeader className="dark:bg-gray-800 bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="px-4">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <>
                            {isLoading ? (
                                <TableSkeleton columns={columns.length} />
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    )}
                </TableBody>
            </Table>
            <PaginationComponent table={table} />
        </>
    );
}

export default function TableComponent<TData, TValue>({
    columns,
    url,
}: {
    columns: ColumnDef<TData, TValue>[];
    url: keyof EndpointType;
}) {
    const { data, isLoading } = GetQuery(url);
    console.log("table", data);

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
                <TableInstance
                    columns={columns}
                    data={data?.data?.results || data?.data || []}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
