import { DataTypes, Model } from 'sequelize';
import { database } from '../config/database';

class RegistroActivos extends Model {
    public id_reg!: number;
    public id_act!: string;
    public nom_act!: string;
    public mar_act!: string;
    public mod_act!: string;
    public serie_act!: string;
    public pro_per!: string;
    public ubi_act_per!: number;
    public estado!: string;
    public fecha_compra!: Date;
    public registrado_por!: number;
    public responsable!: string;
    public tipo_activo!: string;
}

RegistroActivos.init(
    {
        id_reg: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_act: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        nom_act: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        mar_act: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        mod_act: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        serie_act: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        pro_per: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        ubi_act_per: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        fecha_compra: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        registrado_por: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        responsable: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        tipo_activo: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: 'registroactivos',
        timestamps: false,
        schema: 'public',
    }
);

export default RegistroActivos;
