import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/actives/data-table';
import { Active, columns } from '../tables/actives/columns';
import { useEffect, useRef } from 'react';
import { Table } from '@tanstack/react-table';
import Modal from '../components/Modal';
import data from './MOCK_DATA.json';

const ActivesPage = () => {
    const tableRef = useRef<Table<Active>>(null);

    useEffect(() => {
        // console.log(tableRef.current)
        // tableRef.current?.getColumn('type')?.setFilterValue('Monitor')
    }, [tableRef])

    const prueba = () => {
        tableRef.current?.getColumn('type')?.setFilterValue('')
        // console.log('prueba')
    }

    return (
        <section className="actives-page">
            <header className='actives-header'>
                <h1>Inventario de activos</h1>
                <button className='primary-button'>Agregar activo</button>
            </header>
            <section className="search-section">
                <div className="search-filters">
                    <input type="text" placeholder='Buscar activo' />
                    <ComboBoxInput>
                        <span>Filtrar activo por tipo</span>
                        <span>Monitor</span>
                        <span>PC</span>
                    </ComboBoxInput>
                </div>
                <button className='primary-button' onClick={() => prueba()}>Buscar</button>
            </section>
            <DataTable columns={columns} data={data} ref={tableRef}></DataTable>
            {/* <Modal /> */}
        </section>
    )
};

export default ActivesPage;