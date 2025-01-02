import express from 'express';
import cors from 'cors';
import { database } from './config/database';
import { env } from './config/env';
import { userRouter } from './routes/userRouter';

// ROUTERS
import ProveedoresRouter from './routes/ProveedoresRouter';
import UbicacionesRouter from './routes/UbicacionesRouter';
import ResponsablesRouter from './routes/ResponsablesRouter';
import routerActivos from './routes/ActivosRouter';
import routerMantenimientos from './routes/MantenimientosRouter';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRouter);
app.use('/api/activos', routerActivos);
app.use('/api/proveedores', ProveedoresRouter);
app.use('/api/ubicaciones', UbicacionesRouter);
app.use('/api/responsables', ResponsablesRouter);
app.use('/api/mantenimientos', routerMantenimientos);

database.authenticate()
    .then(() => {
        console.log('Conexión establecida con la base de datos');
        const PORT = env.database.port;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('Error en la conexión a la base de datos:', error);
    });
