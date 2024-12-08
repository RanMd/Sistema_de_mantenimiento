import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import { env } from '../config/env';

class Admin extends Model {
    public id_adm!: number;
    public pass_adm!: string;
}

Admin.init(
    {
        id_adm: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pass_adm: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },
    {
        sequelize: database,
        tableName: env.database.name,
        schema: 'public',
        timestamps: false
    }
)

export { Admin };