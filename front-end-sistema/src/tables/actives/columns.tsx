import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import styles from '../../styles/modules/dropdownmenu.module.css'
import { ActiveToTable } from '../../models/Active';
import { deleteActive } from '../../services/ActiveService';

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

const columns: ColumnDef<ActiveToTable>[] = [
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
        header: ({ column }) => {
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
    },
    {
        header: 'Más acciones',
        cell: ({ row }) => {
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
    },
]

export { columns };