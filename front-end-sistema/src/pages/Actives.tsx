import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/data-table';
import { columnsActive } from '../tables/columns';
import { ModalCrearActivo } from '../components/ModalCreaActivo';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { Modal } from '../components/Modal';
import { ActiveToTable, ProcesoCompra, Ubicacion } from '../models/Active';
import { getActives, getCategories, getProcesses, getTypes, getUbicaciones } from '../services/ActiveService';
import { useAuth } from '../context/useAuth';

const ActivesPage = () => {
    const { hasAdminRol } = useAuth();

    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [categories, setCategories] = useState<string[]>([])
    const [processes, setProcesses] = useState<ProcesoCompra[]>([]);
    const [types, setTypes] = useState<string[]>([]);

    const [modalActiveIsOpen, setModalActiveIsOpen] = useState(false);
    const [modalCrearActiveIsOpen, setModalCrearActiveIsOpen] = useState(false);
    const [activeId, setActiveId] = useState<number>(0);
    const [actives, setActives] = useState<ActiveToTable[]>([]);

    const tableRef = useRef<Table<ActiveToTable>>(null);

    const setFilter = (column: string, value: string) => {
        tableRef.current?.getColumn(column)?.setFilterValue(value)
    }

    const handleModalActive = (id: number) => {
        setActiveId(id);
        setModalActiveIsOpen(true);
    }

    // Fetch data

    const fetchActives = useCallback(async () => {
        const { data } = await getActives()

        if (data) { setActives(data) }
    }, [])

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

    const fetchProcesses = useCallback(async () => {
        const { data } = await getProcesses();

        setProcesses(data);
    }, [])

    useEffect(() => {
        fetchActives()
        fetchUbicaciones()
        fetchCategories()
        fetchTypes()
        fetchProcesses()

    }, [fetchActives, fetchCategories, fetchProcesses, fetchTypes, fetchUbicaciones])

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
            <section className="search-section">
                <div className="search-filters">
                    <input
                        type='text'
                        onChange={(e) => setFilter('name', e.target.value)}
                        placeholder='Buscar activo' />

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
                    <ComboBoxInput
                        setOption={(option) => setFilter('buyProcess', option)}
                        placeholder='Filtrar activo por proceso'
                    >
                        <span>Ninguno</span>
                        {processes.map((process, index) => (
                            <span key={index}>{process.code_proc}</span>
                        ))}
                    </ComboBoxInput>
                </div>
            </section>
            <DataTable columns={columnsActive(hasAdminRol)} data={actives} ref={tableRef} handleModalActive={handleModalActive} ></DataTable>
            <Modal id_activo={activeId} isOpen={modalActiveIsOpen} setIsOpen={setModalActiveIsOpen} />
            {modalCrearActiveIsOpen && <ModalCrearActivo isOpen={modalCrearActiveIsOpen} setIsOpen={setModalCrearActiveIsOpen} />}
        </section>
    )
};

export default ActivesPage;