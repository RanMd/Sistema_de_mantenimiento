import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import Ubicaciones from './Ubicaciones';

// MARCAS ACTIVO

class MarcaActivo extends Model {
    public name_fab!: string;
    public category_fab!: string;
}

MarcaActivo.init({
    name_fab: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    category_fab: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'fabricantes',
    timestamps: false,
    schema: 'public',

});

// CATEGORIAS ACTIVO

class CategoriaActivo extends Model {
    public name_type!: string;
    public category_type!: string;
}

CategoriaActivo.init({
    name_type: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    category_type: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'tipos_activo',
    timestamps: false,
    schema: 'public',

});

//  PROCESOS DE COMPRA

class Provider extends Model {
    public id_pro!: number;
    public name_pro!: string;
    public address_pro!: string;
}

Provider.init({
    id_pro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_pro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_pro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database,
    tableName: 'proveedores',
    timestamps: false,
    schema: 'public',
});

class ProcesoCompra extends Model {
    public id_proc!: number;
    public code_proc!: string;
    public date_proc!: string;
    public provider_proc!: number;
}

ProcesoCompra.init({
    id_proc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code_proc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_proc: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    provider_proc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proveedores',
            key: 'id_pro',
        },
    },
}, {
    sequelize: database,
    tableName: 'procesos_compra',
    timestamps: false,
    schema: 'public',
});

ProcesoCompra.belongsTo(Provider, {
    foreignKey: 'provider_proc',
    as: 'provider',
});

// ACTIVO

class Activo extends Model {
    public id_act!: string;
    public name_act!: string;
    public code_act!: string;
    public ubication_act!: string;
    public state_act!: string;
    public brand_act!: string;
    public type_act!: string;
    public buy_process_act!: number;
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

Activo.belongsTo(CategoriaActivo, {
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

export { Activo, CategoriaActivo, MarcaActivo, ProcesoCompra, Provider };