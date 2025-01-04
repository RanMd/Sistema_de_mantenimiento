import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import Componente from './componente';
import { Activo } from './Activos';
import Mantenimiento from './Mantenimiento';

class ComponenteActivoMantenimiento extends Model {
    public id_com_per!: number;
    public activo_per!: number;
    public num_mant_per!: number;
}

ComponenteActivoMantenimiento.init({
    id_com_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'componente',
            key: 'id_comp',
        },
        primaryKey: true,
    },
    activo_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'activos',
            key: 'id_act',
        },
        primaryKey: true,
    },
    num_mant_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'mantenimientos',
            key: 'num_mant',
        },
        primaryKey: true,
    },
}, {
    sequelize: database,
    tableName: 'componente_activo_mantenimiento',
    timestamps: false,
    schema: 'public',
});

ComponenteActivoMantenimiento.belongsTo(Componente, {
    foreignKey: 'id_com_per',
    as: 'componente',
});

ComponenteActivoMantenimiento.belongsTo(Activo, {
    foreignKey: 'activo_per',
    as: 'activo',
});

ComponenteActivoMantenimiento.belongsTo(Mantenimiento, {
    foreignKey: 'num_mant_per',
    as: 'mantenimiento',
});

export default ComponenteActivoMantenimiento;
