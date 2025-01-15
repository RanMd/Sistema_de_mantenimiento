import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class Mantenimiento extends Model {
    public num_mant!: number;
    public code_mant!: string;
    public type_attendant_mant!: string;
    public attendant_mant!: number;
    public date_start_mant!: Date;
    public date_end_mant?: Date;
    public state_mant!: string;
}

Mantenimiento.init({
    num_mant: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code_mant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type_attendant_mant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    attendant_mant: {
        type: DataTypes.STRING,
    },
    date_start_mant: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    date_end_mant: {
        type: DataTypes.DATE,
    },
    state_mant: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    sequelize: database,
    tableName: 'mantenimientos',
    timestamps: false,
    schema: 'public',
});



export default Mantenimiento;
