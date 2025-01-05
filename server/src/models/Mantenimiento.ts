import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import { User } from './userModel';

class Mantenimiento extends Model {
    public num_mant!: number;
    public cod_mant!: string;
    public user_mant!: number;
    public start_mant!: Date;
    public end_mant?: Date;
    public state_mant!: string;
    public description!: string;
}

Mantenimiento.init({
    num_mant: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cod_mant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_mant: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id_user',
        },
    },
    start_mant: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_mant: {
        type: DataTypes.DATE,
    },
    state_mant: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize: database,
    tableName: 'mantenimientos',
    timestamps: false,
    schema: 'public',
});

Mantenimiento.belongsTo(User, {
    foreignKey: 'user_mant',
    as: 'usuario',
});

export default Mantenimiento;
