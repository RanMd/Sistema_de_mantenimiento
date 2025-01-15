import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Productores extends Model {
    public id_pro!: number;
    public name_pro!: string;
    public address_pro!: string;
}

Productores.init({
    id_pro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name_pro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_pro: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: database,
    tableName: 'proveedores',
    timestamps: false,
    schema: 'public',
});

export default Productores;