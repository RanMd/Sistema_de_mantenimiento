import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';
import { User } from './userModel';  // Importa el modelo User si es necesario



class Mantenimiento extends Model {
    public num_mant!: number;
    public code_mant!: string;
    public type_attendant_mant!: string;
    public attendant_mant!: string;  // Referencia a User
    public date_start_mant!: Date;
    public date_end_mant?: Date;
    public state_mant!: string;

    // Relaciones añadidas:
    public attendant!: User;        // Relación con User (responsable)
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
        type: DataTypes.STRING,  // Aquí lo podemos hacer referenciar al modelo 'User'
        references: {
            model: 'usuarios',  // Asegúrate de que sea el nombre correcto de la tabla 'usuarios'
            key: 'id_user',
        },
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
        type: DataTypes.STRING,  // En lugar de SMALLINT, utilizamos un tipo de texto para el estado
        defaultValue: 'pendiente',  // Puedes definir un valor predeterminado
    },
}, {
    sequelize: database,
    tableName: 'mantenimientos',
    timestamps: false,
    schema: 'public',
});

// Relaciones
Mantenimiento.belongsTo(User, {
    foreignKey: 'attendant_mant',
    as: 'attendant',  // Establece el alias para la relación
});



export default Mantenimiento;
