import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class User extends Model {
    public id_user!: number;
    public name_user!: string;
    public pass_user!: string;
    public rol_user!: string;
}

User.init(
    {
        id_user: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name_user: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        pass_user: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rol_user: {
            type: DataTypes.CHAR(1),
            allowNull: false
        }
    },
    {
        sequelize: database,
        tableName: 'usuarios',
        schema: 'public',
        timestamps: false
    }
)

export { User };