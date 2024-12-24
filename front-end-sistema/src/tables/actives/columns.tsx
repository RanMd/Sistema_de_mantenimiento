import { ColumnDef } from '@tanstack/react-table';

type Active = {
    id: number;
    code: string;
    name: string;
    ubication: string;
    type: string;
};

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
        }
    },
]