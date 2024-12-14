import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Ubicaciones extends Model {
    public id_ubi!: number;
    public edi_ubi!: string;
    public piso_ubi!: string;
    public num_lab_ubi!: string;
}

Ubicaciones.init({
    id_ubi: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    edi_ubi: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    piso_ubi: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    num_lab_ubi: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'ubicaciones',
    timestamps: false,
    schema: 'public',
});

export default Ubicaciones;