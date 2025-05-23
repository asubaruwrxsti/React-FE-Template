import { useState, useMemo } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    RowSelectionState,
    VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Search, RefreshCcw, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataLoader } from "./data-loader";
import { Skeleton } from "./skeleton";
import { usePagination } from "@/hooks/use-pagination";
import type { ApiError } from "@/types/App/error-handler";

export interface DataTableProps<TData, TValue> {
    /**
     * The columns configuration for the table
     */
    columns: ColumnDef<TData, TValue>[];

    /**
     * The data to display in the table
     */
    data: TData[];

    /**
     * Whether the data is currently loading
     */
    isLoading?: boolean;

    /**
     * Any error that occurred while loading the data
     */
    error?: ApiError | Error | null;

    /**
     * Function to refresh the data
     */
    onRefresh?: () => void;

    /**
     * Title for the table
     */
    title?: string;

    /**
     * Whether to show the search input
     */
    showSearch?: boolean;

    /**
     * The column to search by default
     */
    searchColumn?: string;

    /**
     * Whether to show column visibility toggle
     */
    showColumnToggle?: boolean;

    /**
     * Default pagination settings
     */
    pagination?: {
        pageIndex?: number;
        pageSize?: number;
    };

    /**
     * Function called when row selection changes
     */
    onRowSelectionChange?: (rows: TData[]) => void;

    /**
     * Additional actions to render in the header
     */
    headerActions?: React.ReactNode;

    /**
     * Function to render row subcomponent
     */
    renderSubComponent?: (row: TData) => React.ReactNode;

    /**
     * Default column filters
     */
    defaultColumnFilters?: ColumnFiltersState;

    /**
     * Default sorting
     */
    defaultSorting?: SortingState;

    /**
     * Height of the table body
     */
    tableBodyHeight?: string;
}

/**
 * A reusable data table component with sorting, filtering, and pagination
 * 
 * @example
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   isLoading={isLoading}
 *   error={error}
 *   onRefresh={fetchData}
 *   title="Users"
 *   showSearch
 *   searchColumn="name"
 * />
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    error = null,
    onRefresh,
    title,
    showSearch = true,
    searchColumn,
    showColumnToggle = true,
    pagination = { pageIndex: 0, pageSize: 10 },
    onRowSelectionChange,
    headerActions,
    renderSubComponent,
    defaultColumnFilters = [],
    defaultSorting = [],
    tableBodyHeight,
}: DataTableProps<TData, TValue>) {
    // Table state
    const [sorting, setSorting] = useState<SortingState>(defaultSorting);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        defaultColumnFilters
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Get pagination controls
    const {
        currentPage,
        pageSize,
        setCurrentPage,
        setPageSize,
    } = usePagination({
        initialPage: pagination.pageIndex || 0,
        initialPageSize: pagination.pageSize || 10,
    });

    // Initialize the table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: currentPage,
                pageSize,
            },
        },
        enableRowSelection: !!onRowSelectionChange,
    });

    // Effect to call the row selection callback when selection changes
    useMemo(() => {
        if (onRowSelectionChange) {
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map((row) => row.original);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, table]);

    // Render loading skeleton
    const renderSkeleton = () => {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="rounded-md border">
                    <div className="border-b">
                        <div className="flex h-10 items-center px-4">
                            {columns.map((column, i) => (
                                <Skeleton key={i} className="h-4 w-full max-w-[150px] mx-2" />
                            ))}
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex h-12 items-center px-4 border-b">
                            {columns.map((_, j) => (
                                <Skeleton key={j} className="h-4 w-full max-w-[150px] mx-2" />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        );
    };

    return (
        <Card>
            {title && (
                <CardHeader className="py-4">
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent>
                <DataLoader
                    data={data}
                    isLoading={isLoading}
                    error={error}
                    onRetry={onRefresh}
                    showSkeleton={true}
                    skeleton={renderSkeleton()}
                >
                    {() => (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                {showSearch && searchColumn && (
                                    <div className="flex items-center gap-2">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={`Search...`}
                                            value={
                                                (table
                                                    .getColumn(searchColumn)
                                                    ?.getFilterValue() as string) ?? ""
                                            }
                                            onChange={(event) =>
                                                table
                                                    .getColumn(searchColumn)
                                                    ?.setFilterValue(event.target.value)
                                            }
                                            className="h-8 w-[150px] lg:w-[250px]"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {headerActions}

                                    {onRefresh && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={onRefresh}
                                            className="h-8"
                                        >
                                            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                                            Refresh
                                        </Button>
                                    )}

                                    {showColumnToggle && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8">
                                                    Columns
                                                    <ChevronDown className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {table
                                                    .getAllColumns()
                                                    .filter(
                                                        (column) =>
                                                            typeof column.accessorFn !== "undefined" &&
                                                            column.getCanHide()
                                                    )
                                                    .map((column) => {
                                                        return (
                                                            <DropdownMenuCheckboxItem
                                                                key={column.id}
                                                                className="capitalize"
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) =>
                                                                    column.toggleVisibility(value)
                                                                }
                                                            >
                                                                {column.id.replace(/([A-Z])/g, " $1").trim()}
                                                            </DropdownMenuCheckboxItem>
                                                        );
                                                    })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <div
                                    style={{
                                        maxHeight: tableBodyHeight,
                                        overflowY: tableBodyHeight ? 'auto' : 'visible',
                                    }}
                                >
                                    <Table>
                                        <TableHeader>
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <TableHead key={header.id}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows?.length ? (
                                                table.getRowModel().rows.map((row) => (
                                                    <>
                                                        <TableRow
                                                            key={row.id}
                                                            data-state={
                                                                row.getIsSelected() ? "selected" : undefined
                                                            }
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                        {renderSubComponent && row.getIsExpanded() && (
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan={row.getVisibleCells().length}
                                                                    className="p-0"
                                                                >
                                                                    {renderSubComponent(row.original)}
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </>
                                                ))
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
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-2 py-4">
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                        <span>
                                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                            {table.getFilteredRowModel().rows.length} row(s) selected.
                                        </span>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DataLoader>
            </CardContent>
        </Card>
    );
}
