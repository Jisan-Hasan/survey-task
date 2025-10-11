/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { GetQuery } from "@/lib/queries";
import type { AnyType, EndpointType } from "@/lib/types";
import type { ColDef } from "ag-grid-community";
import { themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import GridSkeleton from "../skeleton/grid-skelton";
import Pagination from "./pagination";
// @ts-ignore
import "ag-grid-community/styles/ag-grid.css";
// @ts-ignore
import "ag-grid-community/styles/ag-theme-quartz.min.css";

// Create new GridExample component
export default function GridComponent({
    columns,
    url,
    params,
    tableData,
    pathname,
    rowClass,
    serverSidePagination = true,
    initialPageSize = 10,
}: {
    columns: ColDef[];
    url?: keyof EndpointType;
    params?: AnyType;
    tableData?: AnyType;
    pathname?: string;
    rowClass?: AnyType;
    serverSidePagination?: boolean;
    initialPageSize?: number;
}) {
    const { theme } = useTheme();
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const gridRef = useRef<AgGridReact>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const queryParams = serverSidePagination
        ? {
              ...params,
              limit: pageSize,
              offset: (currentPage - 1) * pageSize,
          }
        : {
              ...params,
              limit: 10000,
              offset: 0,
          };

    const { data, isLoading } = GetQuery(
        url as keyof EndpointType,
        {
            params: queryParams,
            pathname: pathname ? pathname : undefined,
        },
        url ? true : false
    );

    console.log(`grid-${url}`, tableData || data);

    useEffect(() => {
        setColDefs(columns);
    }, [columns]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    const totalItems = serverSidePagination
        ? data?.data?.count || 0
        : tableData?.length || data?.data?.results?.length || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentData = tableData || data?.data?.results || [];

    if (isLoading) {
        return <GridSkeleton />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div
                className={`ag-theme-quartz${theme === "dark" ? "-dark" : ""}`}
                style={{ width: "auto", height: "520px" }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={currentData}
                    columnDefs={colDefs}
                    defaultColDef={{ flex: 1 }}
                    pagination={!serverSidePagination}
                    paginationPageSize={serverSidePagination ? undefined : 10}
                    paginationPageSizeSelector={
                        serverSidePagination ? undefined : [10, 20, 30, 50, 100]
                    }
                    enableCellTextSelection={true}
                    getRowClass={rowClass}
                    theme={themeBalham}
                />
            </div>

            {serverSidePagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[10, 20, 30, 50, 100]}
                />
            )}
        </div>
    );
}
