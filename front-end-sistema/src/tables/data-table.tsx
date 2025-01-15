import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    SortingState,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Table,
    Row
} from '@tanstack/react-table';
import { Fragment } from 'react/jsx-runtime';
import { Ref, useImperativeHandle, useState } from 'react';
import styles from '../styles/modules/table.module.css'

interface IDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    ref?: Ref<Table<TData>>;
    pageSize?: number;
}

const DataTable = <TData, TValue>({ columns, data, ref, pageSize = 10 }: IDataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            }
        },
        state: {
            sorting,
            columnFilters,
            rowSelection
        }
    })

    useImperativeHandle(ref, () => table, [table]);

    return (
        <div
            className={styles.ActivesTable}
            style={{
                '--grid-table': '1fr '.repeat(table.getHeaderGroups()[0].headers.length)
            } as React.CSSProperties}
        >
            <div className={styles.ColumnHeaders}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Fragment key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <span key={header.id}>
                                {header.isPlaceholder ? null : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </span>
                        ))}
                    </Fragment>
                ))}
            </div>
            <ul className={styles.RowBody}>
                {table.getRowModel().rows?.length ?
                    table.getRowModel().rows.map((row) => (
                        <li
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                        >
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <span key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </span>
                                )
                            })}
                        </li>
                    )) :
                    <li className={styles.NoData}>
                        <span>No existe ningun dato.</span>
                    </li>
                }
            </ul>
            <DataTablePagination table={table} />
        </div>
    );
}

const arrowIcon = (
    <svg fill="currentColor"
        className={styles.PaginationIcon}
        height="200px"
        width="200px"
        version="1.1" id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 55.752 55.752" xmlSpace="preserve">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <g>
                <path d="M43.006,23.916c-0.28-0.282-0.59-0.52-0.912-0.727L20.485,1.581c-2.109-2.107-5.527-2.108-7.637,0.001 c-2.109,2.108-2.109,5.527,0,7.637l18.611,18.609L12.754,46.535c-2.11,2.107-2.11,5.527,0,7.637c1.055,1.053,2.436,1.58,3.817,1.58 s2.765-0.527,3.817-1.582l21.706-21.703c0.322-0.207,0.631-0.444,0.912-0.727c1.08-1.08,1.598-2.498,1.574-3.912 C44.605,26.413,44.086,24.993,43.006,23.916z"></path>
            </g>
        </g>
    </svg>
)

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

const DataTablePagination = <TData,>({ table }: DataTablePaginationProps<TData>) => {
    const [pageCount, setPageCount] = useState<number>(1);

    const handleNextPage = () => {
        setPageCount((count) => count + 1);
        table.nextPage()
    }

    const handlePreviousPage = () => {
        setPageCount((count) => count - 1);
        table.previousPage()
    }

    return (
        <div className={styles.PaginationButtons}>
            <button
                onClick={handlePreviousPage}
                disabled={!table.getCanPreviousPage()}
            >
                {arrowIcon}
            </button>
            <span>{pageCount}</span>
            <button
                onClick={handleNextPage}
                disabled={!table.getCanNextPage()}
            >
                {arrowIcon}
            </button>
        </div>
    )
}

interface IDataTableReportProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    ref?: Ref<Table<TData>>;
    pageSize?: number;
    renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement
    getRowCanExpand: (row: Row<TData>) => boolean
}

const DataTableReport = <TData, TValue>({ columns, data, ref, pageSize = 10, getRowCanExpand, renderSubComponent }: IDataTableReportProps<TData, TValue>) => {
    const table = useReactTable({
        columns,
        data,
        getRowCanExpand,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            }
        }
    })

    useImperativeHandle(ref, () => table, [table]);

    return (
        <div
            className={styles.ActivesTable}
            style={{
                '--grid-table': '1fr '.repeat(table.getHeaderGroups()[0].headers.length)
            } as React.CSSProperties}
        >
            <div className={styles.ColumnHeaders}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Fragment key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <span key={header.id}>
                                {header.isPlaceholder ? null : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </span>
                        ))}
                    </Fragment>
                ))}
            </div>
            <ul className={styles.RowBody}>
                {table.getRowModel().rows?.length ?
                    table.getRowModel().rows.map((row) => {
                        return (
                            <Fragment key={row.id}>
                                <li
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <span key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </span>
                                        )
                                    })}
                                </li>
                                {row.getIsExpanded() && (
                                    <li className={styles.SubComponent}>
                                        {renderSubComponent({ row })}
                                    </li>
                                )}
                            </Fragment>
                        )
                    }) :
                    <li className={styles.NoData}>
                        <span>No existe ningun dato.</span>
                    </li>
                }
            </ul>
            <DataTablePagination table={table} />
        </div>
    );
}


export { DataTable, DataTableReport };