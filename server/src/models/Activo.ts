import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import Ubicaciones from './Ubicaciones';
import { MarcaActivo, TypeActive, ProcesoCompra } from './Activos'

class Activo extends Model {
    public id_act!: number;
    public name_act!: string;
    public code_act!: string;
    public ubication_act!: string;
    public state_act!: string;
    public brand_act!: string;
    public type_act!: string;
    public buy_process_act!: number;
    public in_maintenance!: boolean;

    // Relaciones añadidas:
    public ubication!: Ubicaciones; // Relación con Ubicaciones
    public marca!: MarcaActivo;     // Relación con MarcaActivo
    public category!: TypeActive;   // Relación con TypeActive
    public buy_process!: ProcesoCompra; // Relación con ProcesoCompra
}

Activo.init({
    id_act: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_act: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code_act: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ubication_act: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'ubicaciones',
            key: 'id_ubi',
        },
    },
    state_act: {
        type: DataTypes.STRING,
    },
    brand_act: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_act: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tipoActivo',
            key: 'name_type',
        },
    },
    buy_process_act: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    in_maintenance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'activos',
    timestamps: false,
    schema: 'public',
});

Activo.belongsTo(Ubicaciones, {
    foreignKey: 'ubication_act',
    as: 'ubication',
});

Activo.belongsTo(TypeActive, {
    foreignKey: 'type_act',
    as: 'category',
});

Activo.belongsTo(MarcaActivo, {
    foreignKey: 'brand_act',
    as: 'marca',
});

Activo.belongsTo(ProcesoCompra, {
    foreignKey: 'buy_process_act',
    as: 'buy_process',
});

export { Activo };