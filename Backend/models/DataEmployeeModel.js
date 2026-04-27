import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

// Employee model - maps to Indonesian database column 'employeeData'
// Field mapping: English property name -> Indonesian database column name
const Employee = db.define('employeeData', {
    employeeId: {
        type: DataTypes.STRING,
        field: 'id_pegawai', // Database column: employeeId
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nationalId: {
        type: DataTypes.STRING(16),
        field: 'nik', // Database column: nationalId
        allowNull: false
    },
    employeeName: {
        type: DataTypes.STRING(100),
        field: 'nama_pegawai', // Database column: employeeName
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING(15),
        field: 'jenis_kelamin', // Database column: gender
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50),
        field: 'jabatan', // Database column: position
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING(50),
        defaultValue: 'Helper',
        allowNull: false
    },
    joinDate: {
        type: DataTypes.STRING,
        field: 'tanggal_masuk', // Database column: joinDate
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    url: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        field: 'hak_akses', // Database column: role
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    // Sequelize will use the model name 'Employee' but query table 'employeeData'
    tableName: 'data_pegawai'
});

export default Employee;
