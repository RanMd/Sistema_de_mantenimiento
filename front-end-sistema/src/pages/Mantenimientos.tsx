import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/data-table';
import { columnsMaintenance } from '../tables/columns';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { getAllMaintenance } from '../services/ActiveService';
import { ModalCrearMantenimiento } from '../components/ModalCrearMantenimiento';
import { Maintenance } from '../models/Maintenance';

const MantenimientosPage = () => {
    const [modalCrearProviderIsOpen, setModalCrearProviderIsOpen] = useState(false);

    const [maintenance, setMaintenance] = useState<Maintenance[]>([])
    const [dateFilter, setDateFilter] = useState<{
        year: string,
        month: string
    }>({ year: '', month: '' })

    const tableRef = useRef<Table<Maintenance>>(null);

    const setFilter = (column: string, value: string) => {
        tableRef.current?.getColumn(column)?.setFilterValue(value)
    }

    const handleDateFilter = (value: string, isYear: boolean = true) => {
        const updateFilter = isYear
            ? { ...dateFilter, year: value }
            : { ...dateFilter, month: value };

        setDateFilter(updateFilter);

        const filter = updateFilter.year || updateFilter.month
            ? `${updateFilter.year}${updateFilter.month ? `-${updateFilter.month}-` : ''}`
            : '';

        console.log(filter)

        tableRef.current?.getColumn('date_start_mant')?.setFilterValue(filter)
    }

    // Fetch data

    const fetchProcesses = useCallback(async () => {
        const { data } = await getAllMaintenance();

        if (data) { setMaintenance(data) }
    }, [])

    useEffect(() => {
        fetchProcesses();
    }, [fetchProcesses])

    return (
        <section className="actives-page">
            <header className='actives-header'>
                <h1>Registro de mantenimientos</h1>
                <button className='primary-button' onClick={() => setModalCrearProviderIsOpen(true)}>Crear mantenimiento</button>
            </header>
            <section className="search-section">
                <div className="search-filters">
                    <input
                        type='text'
                        onChange={(e) => setFilter('code_mant', e.target.value)}
                        placeholder='Buscar mantenimiento' />

                    <ComboBoxInput
                        setOption={(option) => handleDateFilter(option)}
                        placeholder='Filtrar mantenimiento por año'
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
                        setOption={(option) => {
                            const month = option === 'Enero' ? '01' : option === 'Febrero' ? '02' : option === 'Marzo' ? '03' : option === 'Abril' ? '04' : option === 'Mayo' ? '05' : option === 'Junio' ? '06' : option === 'Julio' ? '07' : option === 'Agosto' ? '08' : option === 'Septiembre' ? '09' : option === 'Octubre' ? '10' : option === 'Noviembre' ? '11' : option === 'Diciembre' ? '12' : '';

                            handleDateFilter(month, false);
                        }}
                        placeholder='Filtrar mantenimiento por mes'
                    >
                        <span>Ninguno</span>
                        <span>Enero</span>
                        <span>Febrero</span>
                        <span>Marzo</span>
                        <span>Abril</span>
                        <span>Mayo</span>
                        <span>Junio</span>
                        <span>Julio</span>
                        <span>Agosto</span>
                        <span>Septiembre</span>
                        <span>Octubre</span>
                        <span>Noviembre</span>
                        <span>Diciembre</span>
                    </ComboBoxInput>
                    <ComboBoxInput
                        setOption={(option) => {
                            const state = option === 'Abierto' ? '1' : option === 'Cerrado' ? '0' : ''
                            setFilter('state_mant', state)
                        }}
                        placeholder='Filtrar mantenimiento por estado'
                    >
                        <span>Ninguno</span>
                        <span>Abierto</span>
                        <span>Cerrado</span>
                    </ComboBoxInput>
                </div>
            </section>
            <DataTable columns={columnsMaintenance} data={maintenance} ref={tableRef}></DataTable>
            {modalCrearProviderIsOpen && <ModalCrearMantenimiento isOpen={modalCrearProviderIsOpen} setIsOpen={setModalCrearProviderIsOpen} />}
        </section>
    )
};

export default MantenimientosPage;