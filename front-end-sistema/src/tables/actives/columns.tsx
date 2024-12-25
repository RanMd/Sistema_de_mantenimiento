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

type Active = {
    id: number;
    code: string;
    name: string;
    ubication: string;
    type: string;
};

const optionSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </svg>
)

export const columns: ColumnDef<Active>[] = [
    {
        header: 'Código',
        accessorKey: 'code',
    },
    {
        header: 'Nombre',
        accessorKey: 'name',
    },
    {
        header: 'Ubicación',
        accessorKey: 'ubication',
    },
    {
        header: 'Tipo',
        accessorKey: 'type',
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
                            <DropdownMenuLabel className={styles.Label}>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem className={styles.Item}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className={styles.Item}>
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenuPortal>
                </DropdownMenu>
            )
        }
    },
]