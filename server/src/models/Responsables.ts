import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Responsables extends Model {
    public id_res!: string;
    public nom_res!: string;
    public ape_res!: string;
}

Responsables.init({
    id_res: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    nom_res: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    ape_res: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'responsables',
    timestamps: false,
    schema: 'public',
});

export default Responsables;