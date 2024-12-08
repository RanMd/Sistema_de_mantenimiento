import express from 'express';
import { adminRouter } from './routes/adminRoute';
import { database } from './config/database';
import cors from 'cors';
import { env } from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', adminRouter);

database.authenticate().then(() => {
    console.log('Conexion establecida')
    app.listen(env.port, () => {
        console.log(`Sevidor corriendo en el http://localhost:${env.port}`)
    })
}).catch((error) => {
    console.log('Error en la conexion', error)
})
