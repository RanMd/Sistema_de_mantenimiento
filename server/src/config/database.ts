import { Sequelize } from 'sequelize';
import { env } from './env';

const database = new Sequelize(env.database.name, env.database.user, env.database.password, {
    dialect: env.dialect,
    host: env.database.host,
    logging: (msg) => console.log(`[Sequelize]: ${msg}`)
});

export { database };