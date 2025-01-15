import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/data-table';
import { columnsActive } from '../tables/columns';
import { ModalCrearActivo } from '../components/ModalCreaActivo';
import { useRef, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { ColumnDef, Table } from '@tanstack/react-table';
import { ModalActive } from '../components/ModalActive';
import { ActiveToTable, Ubicacion } from '../models/Active';
import { getActives, getCategories, getTypes, getUbicaciones } from '../services/ActiveService';
import { useAuth } from '../context/useAuth';

const ActivesPage = () => {
    const { hasAdminRol } = useAuth();

    const [modalActiveIsOpen, setModalActiveIsOpen] = useState(false);
    const [modalCrearActiveIsOpen, setModalCrearActiveIsOpen] = useState(false);
    const [activeId, setActiveId] = useState<number>(0);

    const [actives, setActives] = useState<ActiveToTable[]>([]);

    const fetchActives = useCallback(async () => {
        const { data } = await getActives()

        if (data) { setActives(data) }
    }, [])

    const handleModalActive = (id: number) => {
        setActiveId(id);
        setModalActiveIsOpen(true);
    }

    useEffect(() => {
        fetchActives();
    }, [fetchActives])

    return (
        <section className="actives-page">
            <header className='actives-header'>
                <h1>Inventario de activos</h1>
                {hasAdminRol && (
                    <button
                        className='primary-button'
                        onClick={() => setModalCrearActiveIsOpen(true)}
                    >
                        Agregar activo
                    </button>
                )
                }
            </header>
            <TableComponent columns={columnsActive(hasAdminRol, handleModalActive)} data={actives}/>
            <ModalActive id_activo={activeId} isOpen={modalActiveIsOpen} setIsOpen={setModalActiveIsOpen} />
            {modalCrearActiveIsOpen && <ModalCrearActivo isOpen={modalCrearActiveIsOpen} setIsOpen={setModalCrearActiveIsOpen} />}
        </section>
    )
};

const TableComponent = ({ columns, pageSize, ref, data }: {
    columns: ColumnDef<ActiveToTable>[],
    pageSize?: number,
    ref?: React.Ref<Table<ActiveToTable>>,
    data: ActiveToTable[]
}) => {
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [categories, setCategories] = useState<string[]>([])
    const [types, setTypes] = useState<string[]>([]);

    const tableRef = useRef<Table<ActiveToTable>>(null);

    const setFilter = (column: string, value: string) => {
        tableRef.current?.getColumn(column)?.setFilterValue(value)
    }

    useImperativeHandle(ref, () => tableRef.current!, [tableRef])

    // Fetch data

    const fetchUbicaciones = useCallback(async () => {
        const { data } = await getUbicaciones()

        setUbicaciones(data);
    }, [])

    const fetchCategories = useCallback(async () => {
        const { data } = await getCategories();

        setCategories(data)
    }, [])

    const fetchTypes = useCallback(async () => {
        const { data } = await getTypes();

        setTypes(data);
    }, [])

    useEffect(() => {
        fetchUbicaciones()
        fetchCategories()
        fetchTypes()

    }, [fetchCategories, fetchTypes, fetchUbicaciones])

    return (
        <>
            <section className="search-section">
                <div className="search-filters">
                    <input
                        type='text'
                        onChange={(e) => setFilter('code', e.target.value)}
                        placeholder='Buscar activo por código' />
                    <input
                        type='text'
                        onChange={(e) => setFilter('name', e.target.value)}
                        placeholder='Buscar activo por nombre' />

                    <ComboBoxInput
                        setOption={(option) => setFilter('category', option)}
                        placeholder='Filtrar activo por categoria'
                    >
                        <span>Ninguno</span>
                        {categories.map((category, index) => {
                            return (
                                <span key={index}>{category}</span>
                            )
                        })}
                    </ComboBoxInput>
                    <ComboBoxInput
                        setOption={(option) => setFilter('type', option)}
                        placeholder='Filtrar activo por tipo'
                    >
                        <span>Ninguno</span>
                        {types.map((type, index) => (
                            <span key={index}>{type}</span>
                        ))}
                    </ComboBoxInput>
                    <ComboBoxInput
                        setOption={(option) => setFilter('ubication', option)}
                        placeholder='Filtrar activo por ubicación'
                    >
                        <span>Ninguno</span>
                        {ubicaciones.map((ubicacion, index) => (
                            <span key={index}>{ubicacion.name_ubi}</span>
                        ))}
                    </ComboBoxInput>
                </div>
            </section>
            <DataTable columns={columns} data={data} ref={tableRef} pageSize={pageSize} />
        </>
    )
}

export default ActivesPage;
export { TableComponent };