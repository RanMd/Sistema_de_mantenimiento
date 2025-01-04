import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import { Activo } from './Activos';

class Componente extends Model {
    public id_comp!: number;
    public name_comp!: string;
    public id_act_per!: number;
}

Componente.init({
    id_comp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_comp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_act_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'activos',
            key: 'id_act',
        },
    },
}, {
    sequelize: database,
    tableName: 'componente',
    timestamps: false,
    schema: 'public',
});

Componente.belongsTo(Activo, {
    foreignKey: 'id_act_per',
    as: 'activo',
});

export default Componente;
