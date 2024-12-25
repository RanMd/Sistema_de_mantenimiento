import { DataTable } from '../tables/actives/data-table';
import { columns } from '../tables/actives/columns';
import Modal from '../components/Modal';
import data from './MOCK_DATA.json';

const ActivesPage = () => {
    return (
        <section className="actives-page">
            <h1>Inventario de activos</h1>
            <section className="search-section">
                <input type="text" placeholder="Buscar activo" />
                <input type="text" placeholder="Filtrar activo" />
            </section>
            <DataTable columns={columns} data={data}></DataTable>
            <Modal />
        </section>
    )
};

export default ActivesPage;