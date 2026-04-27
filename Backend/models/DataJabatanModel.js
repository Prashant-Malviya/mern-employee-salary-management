import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Employee from './DataPegawaiModel.js';

const {DataTypes} = Sequelize;

// Position/Jabatan model - maps to Indonesian database column 'data_jabatan'
// Field mapping: English property name -> Indonesian database column name
const Position = db.define('data_jabatan', {
    positionId: {
        type: DataTypes.STRING,
        field: 'id_jabatan', // Database column: id_jabatan
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    positionName: {
        type: DataTypes.STRING(120),
        field: 'nama_jabatan', // Database column: nama_jabatan
        allowNull: false
    },
    baseSalary: {
        type: DataTypes.INTEGER(50),
        field: 'gaji_pokok', // Database column: gaji_pokok
        allowNull: false
    },
    transportAllowance: {
        type: DataTypes.INTEGER(50),
        field: 'tj_transport', // Database column: tj_transport
        allowNull: false
    },
    mealAllowance: {
        type: DataTypes.INTEGER(50),
        field: 'uang_makan', // Database column: uang_makan
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    tableName: 'data_jabatan'
});

// Define relationship: Employee has many Positions
Employee.hasMany(Position);
Position.belongsTo(Employee, { foreignKey: 'userId' });

export default Position;