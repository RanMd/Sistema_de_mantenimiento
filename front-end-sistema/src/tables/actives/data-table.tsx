import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Fragment } from 'react/jsx-runtime';
import styles from '../../styles/modules/table.module.css'

interface IDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const DataTable = <TData, TValue>({ columns, data }: IDataTableProps<TData, TValue>) => {

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    })

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
        </div>
    );
}

export { DataTable };