import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import { Activo } from './Activos';
import Mantenimiento from './Mantenimiento';

class DetalleMantenimiento extends Model {
    public id_detail!: number;
    public num_mant_per!: number;
    public id_act!: number;
    public state_act!: string;
}

DetalleMantenimiento.init({
    id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    num_mant_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'mantenimientos',
            key: 'num_mant',
        }
    },
    id_act: {
        type: DataTypes.INTEGER,
        references: {
            model: 'activos',
            key: 'id_act',
        }
    },
    state_act: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: database,
    tableName: 'detalle_mantenimiento',
    timestamps: false,
    schema: 'public',
});

DetalleMantenimiento.belongsTo(Activo, {
    foreignKey: 'id_act',
    as: 'activo',
});

DetalleMantenimiento.belongsTo(Mantenimiento, {
    foreignKey: 'num_mant_per',
    as: 'mantenimiento',
});

class DetalleMantenimientoActividades extends Model {
    public id_detail_per!: number;
    public activity_act!: string;
}

DetalleMantenimientoActividades.init({
    id_detail_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'detalle_mantenimiento',
            key: 'id_detail',
        }
    },
    activity_act: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database,
    tableName: 'detalle_mantenimiento_actividades',
    timestamps: false,
    schema: 'public',
});

DetalleMantenimientoActividades.removeAttribute('id');

DetalleMantenimiento.hasMany(DetalleMantenimientoActividades, {
    foreignKey: 'id_detail_per',
    as: 'actividades',
});

class DetalleMantenimientoComponente extends Model {
    public id_detail_per!: number;
    public name_comp_mant!: string;
    public type_mant!: string;
}

DetalleMantenimientoComponente.init({
    id_detail_per: {
        type: DataTypes.INTEGER,
        references: {
            model: 'detalle_mantenimiento',
            key: 'id_detail',
        }
    },
    name_comp_mant: {
        type: DataTypes.STRING,
    },
    type_mant: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: database,
    tableName: 'detalle_mantenimiento_componente',
    timestamps: false,
    schema: 'public',
});

DetalleMantenimientoComponente.removeAttribute('id');

DetalleMantenimiento.hasMany(DetalleMantenimientoComponente, {
    foreignKey: 'id_detail_per',
    as: 'componentes',
});

export default DetalleMantenimiento;
export { DetalleMantenimientoActividades, DetalleMantenimientoComponente };
