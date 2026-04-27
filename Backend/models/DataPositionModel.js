import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Employee from './DataEmployeeModel.js';

const {DataTypes} = Sequelize;

// Position/Position model - maps to Indonesian database column 'data_position'
// Field mapping: English property name -> Indonesian database column name
const Position = db.define('data_position', {
    positionId: {
        type: DataTypes.STRING,
        field: 'id_jabatan', // Database column: id_position
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    positionName: {
        type: DataTypes.STRING(120),
        field: 'nama_jabatan', // Database column: nama_position
        allowNull: false
    },
    baseSalary: {
        type: DataTypes.INTEGER(50),
        field: 'gaji_pokok', // Database column: salary_pokok
        allowNull: false
    },
    transportAllowance: {
        type: DataTypes.INTEGER(50),
        field: 'tj_transport', // Database column: transportAllowance
        allowNull: false
    },
    mealAllowance: {
        type: DataTypes.INTEGER(50),
        field: 'uang_makan', // Database column: mealAllowance
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