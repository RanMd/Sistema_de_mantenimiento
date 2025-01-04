import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import Mantenimiento from './Mantenimiento';
import { Activo } from './Activos';

class DetalleMantenimiento extends Model {
    public num_mant!: number;
    public id_act!: number;
    public state_act!: string;
    public type_mant!: string;
    public comentario!: string;
}

DetalleMantenimiento.init({
    num_mant: {
        type: DataTypes.INTEGER,
        references: {
            model: 'mantenimientos',
            key: 'num_mant',
        },
        primaryKey: true,
    },
    id_act: {
        type: DataTypes.INTEGER,
        references: {
            model: 'activos',
            key: 'id_act',
        },
        primaryKey: true,
    },
    state_act: {
        type: DataTypes.STRING,
    },
    type_mant: {
        type: DataTypes.STRING,
    },
    comentario: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize: database,
    tableName: 'detalle_mantenimiento',
    timestamps: false,
    schema: 'public',
});

DetalleMantenimiento.belongsTo(Mantenimiento, {
    foreignKey: 'num_mant',
    as: 'mantenimiento',
});

DetalleMantenimiento.belongsTo(Activo, {
    foreignKey: 'id_act',
    as: 'activo',
});

export default DetalleMantenimiento;
