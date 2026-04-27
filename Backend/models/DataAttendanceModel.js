import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

// Attendance model - maps to Indonesian database column 'data_attendance'
// Field mapping: English property name -> Indonesian database column name
const Attendance = db.define('data_attendance',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        month: {
            type: DataTypes.STRING(15),
            field: 'bulan', // Database column: month (month)
            allowNull: false
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
        gender: {
            type: DataTypes.STRING(20),
            field: 'jenis_kelamin', // Database column: gender
        },
        positionName: {
            type: DataTypes.STRING(50),
            field: 'nama_jabatan', // Database column: nama_position
        },
        present: {
            type: DataTypes.INTEGER(11),
            field: 'hadir', // Database column: present
        },
        sick: {
            type: DataTypes.INTEGER(11),
            field: 'sakit', // Database column: sick
        },
        absent: {
            type: DataTypes.INTEGER(11),
            field: 'alpha', // Database column: absent
        },
    },{
        freezeTableName: true,
        tableName: 'data_kehadiran'
    });

export default Attendance