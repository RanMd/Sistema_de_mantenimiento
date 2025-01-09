import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/data-table';
import { columnsProcess } from '../tables/columns';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { getProcessesComplete, getProviders } from '../services/ActiveService';
import { Process, Provider } from '../models/Process';
import { ModalCrearProvider } from '../components/ModalCrearProvider';
import { useAuth } from '../context/useAuth';

const ProcessPage = () => {
    const { hasAdminRol } = useAuth();
    const [modalCrearProviderIsOpen, setModalCrearProviderIsOpen] = useState(false);

    const [processes, setProcesses] = useState<Process[]>([])
    const [providers, setProviders] = useState<Provider[]>([])

    const tableRef = useRef<Table<Process>>(null);

    const setFilter = (column: string, value: string) => {
        tableRef.current?.getColumn(column)?.setFilterValue(value)
    }

    // Fetch data

    const fetchProcesses = useCallback(async () => {
        const { data } = await getProcessesComplete();

        if (data) { setProcesses(data) }
    }, [])

    const fetchProviders = useCallback(async () => {
        const { data } = await getProviders();

        if (data) { setProviders(data) }
    }, [])

    useEffect(() => {
        fetchProcesses()
        fetchProviders()
    }, [fetchProcesses, fetchProviders])

    return (
        <section className="actives-page">
            <header className='actives-header'>
                <h1>Procesos de compra registrados</h1>
                {hasAdminRol && (
                    <button
                        className='primary-button'
                        onClick={() => setModalCrearProviderIsOpen(true)}
                    >
                        Agregar Proceso
                    </button>
                )}
            </header>
            <section className="search-section">
                <div className="search-filters">
                    <input
                        type='text'
                        onChange={(e) => setFilter('code_proc', e.target.value)}
                        placeholder='Buscar proceso por codigo' />

                    <ComboBoxInput
                        setOption={(option) => setFilter('date_proc', option)}
                        placeholder='Filtrar proceso por año'
                    >
                        <span>Ninguno</span>
                        <span>2019</span>
                        <span>2020</span>
                        <span>2021</span>
                        <span>2022</span>
                        <span>2023</span>
                        <span>2024</span>
                        <span>2025</span>
                    </ComboBoxInput>
                    <ComboBoxInput
                        setOption={(option) => setFilter('provider_name_pro', option)}
                        placeholder='Filtrar proceso por proveedor'
                    >
                        <span>Ninguno</span>
                        {providers.map((provider, index) => {
                            return (
                                <span key={index}>{provider.name_pro}</span>
                            )
                        })}
                    </ComboBoxInput>
                </div>
            </section>
            <DataTable columns={columnsProcess} data={processes} ref={tableRef}></DataTable>
            {modalCrearProviderIsOpen && <ModalCrearProvider isOpen={modalCrearProviderIsOpen} setIsOpen={setModalCrearProviderIsOpen} />}
        </section>
    )
};

export default ProcessPage;