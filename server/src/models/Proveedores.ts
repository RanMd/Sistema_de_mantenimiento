import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Proveedores extends Model {
    public id_pro!: string;
    public nom_pro!: string;
    public ubi_pro!: string;
    public gar_pro!: number;
}

Proveedores.init({
    id_pro: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    nom_pro: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    ubi_pro: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    gar_pro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'proveedores',
    timestamps: false,
    schema: 'public',
});

export default Proveedores;