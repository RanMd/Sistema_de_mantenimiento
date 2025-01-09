import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { Column, ColumnDef, Row } from '@tanstack/react-table';
import { ActiveToTable } from '../models/Active';
import { deleteActive } from '../services/ActiveService';
import { Process } from '../models/Process';
import { Maintenance } from '../models/Maintenance';
import styles from '../styles/modules/dropdownmenu.module.css'
import stylesTable from '../styles/modules/table.module.css'

const optionSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </svg>
)

const arrowUpDown = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5" />
    </svg>
)
const columnsActive = (hasAdminRol: boolean): ColumnDef<ActiveToTable>[] => {
    const columns: ColumnDef<ActiveToTable>[] = [
        {
            header: 'Codigo',
            accessorKey: 'code',
        },
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Categoria',
            accessorKey: 'category',
        },
        {
            accessorKey: 'type',
            header: ({ column }: { column: Column<ActiveToTable> }) => {
                return (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Tipo
                        {arrowUpDown}
                    </button>
                )
            }
        },
        {
            header: 'Ubicación',
            accessorKey: 'ubication',
        },
        {
            header: 'Proceso de compra',
            accessorKey: 'buyProcess',
        }
    ]

    if (hasAdminRol) {
        columns.push({
            header: 'Más acciones',
            cell: ({ row }: { row: Row<ActiveToTable> }) => {
                const active = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>{optionSVG}</div>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className={styles.Content} align='end'>
                                <DropdownMenuLabel className={styles.Label}>Acción</DropdownMenuLabel>
                                <DropdownMenuItem className={styles.Item}
                                    onClick={() => deleteActive(active.id)}>
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>
                )
            }
        })
    }

    return columns;
}

const columnsProcess: ColumnDef<Process>[] = [
    {
        header: 'Codigo',
        accessorKey: 'code_proc',
    },
    {
        accessorKey: 'date_proc',
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Fecha de compra
                    {arrowUpDown}
                </button>
            )
        },
    },
    {
        header: 'Proveedor',
        accessorKey: 'provider.name_pro',
    }
]

const columnsMaintenance: ColumnDef<Maintenance>[] = [
    {
        header: 'Codigo',
        accessorKey: 'code_mant',
    },
    {
        accessorKey: 'date_start_mant',
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Fecha de inicio
                    {arrowUpDown}
                </button>
            )
        }
    },
    {
        accessorKey: 'date_end_mant',
        header: 'Fecha de fin',
        cell: (({ row }) => {
            const date = row.original.date_end_mant

            return (
                <>{date ? date : 'Sin fecha'}</>
            )
        })
    },
    {
        header: 'Estado',
        accessorKey: 'state_mant',
        cell: (({ row }) => {
            const isActive = row.original.state_mant === '1'
            return (
                <span
                    className={stylesTable.rowGhost}
                    style={{
                        backgroundColor: isActive ? 'white' : 'black',
                        color: isActive ? '' : 'white',
                        borderColor: isActive ? 'rgb(207, 207, 207)' : ''
                    }}
                >

                    {isActive ? 'Abierto' : 'Cerrado'}
                </span>
            )
        })
    }
]

export { columnsActive, columnsProcess, columnsMaintenance };