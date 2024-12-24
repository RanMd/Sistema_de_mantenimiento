import { useEffect } from 'react';
import { columns } from '../tables/actives/columns';
import { DataTable } from '../tables/actives/data-table';
import data from './MOCK_DATA.json'

const ActivesList = () => {
    useEffect(() => {
        console.log(columns)
    }, [])

    return (
        <DataTable columns={columns} data={data}></DataTable>
    );
}

const ActivesPage = () => {
    return (
        <section className="actives-page">
            <h1>Inventario de activos</h1>
            <section className="search-section">
                <input type="text" placeholder="Buscar activo" />
                <input type="text" placeholder="Filtrar activo" />
            </section>
            <ActivesList />
        </section>
    )
};

export default ActivesPage;

// const { actives, loading } = useActives();

// if (loading) return <h1>Cargando</h1>;

// return (
//     <div>
//         <h1>Actives</h1>
//         <ul>
//             {actives.map((active) => (
//                 <li key={active.id}>{active.name}</li>
//             ))}
//         </ul>
//     </div>
// );