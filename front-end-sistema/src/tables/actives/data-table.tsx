import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface IDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const optionSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </svg>
)

const DataTable = <TData, TValue>({ columns, data }: IDataTableProps<TData, TValue>) => {

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="actives-table">
            <div className="column-headers">
                {table.getHeaderGroups().map((headerGroup) => (
                    <>
                        {headerGroup.headers.map((header) => (
                            <span key={header.id}>
                                {header.isPlaceholder ? null : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </span>
                        ))}
                    </>
                ))}
            </div>
            <ul className='row-body'>
                {table.getRowModel().rows?.length
                    ? table.getRowModel().rows.map((row) => (
                        <li
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                        >
                            {row.getVisibleCells().map((cell, index) => {
                                if (index == 4) {
                                    return null
                                }

                                return <span>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </span>
                            })}
                            <span>
                                <div>{optionSVG}</div>
                            </span>
                        </li>
                    ))
                    : <li className="no-data">
                        <span>No existe ningun dato.</span>
                    </li>
                }
            </ul>
        </div>
    );
}

export { DataTable };

// <div className="actives-table">
//     <div className="column-headers">
//         <span>Codigo</span>
//         <span>Nombre</span>
//         <span>Ubicación</span>
//         <span>Tipo</span>
//         <span>Más acciones</span>
//     </div>
//     <ul className="row-body">
//         <li>
//             <span>MNO000012LE</span>
//             <span>Monitor01</span>
//             <span>Laboratorio CTT</span>
//             <span>Informatica</span>
//             <span>
//                 <div>{optionSVG}</div>
//             </span>
//         </li>
//         <li>
//             <span>MNO000012LE</span>
//             <span>Monitor01</span>
//             <span>Laboratorio CTT</span>
//             <span>Informatica</span>
//             <span>
//                 <div>{optionSVG}</div>
//             </span>
//         </li>
//         <li>
//             <span>MNO000012LE</span>
//             <span>Monitor01</span>
//             <span>Laboratorio CTT</span>
//             <span>Informatica</span>
//             <span>
//                 <div>{optionSVG}</div>
//             </span>
//         </li>
//     </ul>
// </div>