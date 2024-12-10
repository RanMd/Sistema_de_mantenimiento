import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class User extends Model {
    public ID_USU!: number;
    public NOM_USU!: string;
    public CON_USU!: string;
    public ROL_USU!: string;
}

User.init(
    {
        ID_USU: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        NOM_USU: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        CON_USU: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ROL_USU: {
            type: DataTypes.CHAR(1),
            allowNull: false
        }

    },
    {
        sequelize: database,
        tableName: 'USUARIOS',
        schema: 'public',
        timestamps: false
    }
)

export { User };