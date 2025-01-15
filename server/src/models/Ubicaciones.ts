import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import Edificios from './Edificios';

class Ubicaciones extends Model {
    public id_ubi!: number;
    public name_ubi!: string;
    public floor_ubi!: string;
    public id_edi_per!: string;
}

Ubicaciones.init({
    id_ubi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name_ubi: {
        type: DataTypes.STRING,
    },
    floor_ubi: {
        type: DataTypes.STRING,
    },
    id_edi_per: {
        type: DataTypes.STRING,
        references: {
            model: 'edificios',
            key: 'id_edi',
        },
    },
}, {
    sequelize: database,
    tableName: 'ubicaciones',
    timestamps: false,
    schema: 'public',
});

Ubicaciones.belongsTo(Edificios, {
    foreignKey: 'id_edi_per',
    as: 'edificio',
});

export default Ubicaciones;