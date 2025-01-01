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
    Table
} from '@tanstack/react-table';
import { Fragment } from 'react/jsx-runtime';
import { Ref, useImperativeHandle, useState } from 'react';
import styles from '../../styles/modules/table.module.css'
import { Active } from './columns';

interface IDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    ref?: Ref<Table<TData>>;
    handleModalActive: (id: number) => void;
}

const DataTable = <TData, TValue>({ columns, data, ref, handleModalActive }: IDataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    useImperativeHandle(ref, () => table, [table]);

    const handleRowClick = (rowOriginal: TData) => {
        const id = (rowOriginal as Active).id
        handleModalActive?.(id)
    }

    return (
        <div className={styles.ActivesTable}>
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
                            {row.getVisibleCells().map((cell, index) => {
                                if (index === 0) {
                                    return (
                                        <span key={cell.id} onClick={() => handleRowClick(cell.row.original)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </span>
                                    )
                                }
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

export { DataTable };