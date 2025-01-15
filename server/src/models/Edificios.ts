import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Edificios extends Model {
    public id_edi!: number;
    public name_edi!: string;
}

Edificios.init({
    id_edi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name_edi: {
        type: DataTypes.STRING,
    },
}, {
    sequelize: database,
    tableName: 'edificios',
    timestamps: false,
    schema: 'public',
});

export default Edificios;