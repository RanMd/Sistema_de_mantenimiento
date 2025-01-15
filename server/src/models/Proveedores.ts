import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Proveedores extends Model {
    public id_pro!: number;
    public name_pro!: string;
    public address_pro!: string;
}

Proveedores.init({
    id_pro: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        autoIncrement: true,
    },
    name_pro: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    address_pro: {
        type: DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize: database,
    tableName: 'proveedores',
    timestamps: false,
    schema: 'public',
});

export default Proveedores;