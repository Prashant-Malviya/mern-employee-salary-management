import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

// Attendance model - maps to Indonesian database column 'data_kehadiran'
// Field mapping: English property name -> Indonesian database column name
const Attendance = db.define('data_kehadiran',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        bulan: {
            type: DataTypes.STRING(15),
            field: 'bulan', // Database column: bulan (month)
            allowNull: false
        },
        nationalId: {
            type: DataTypes.STRING(16),
            field: 'nik', // Database column: nik
            allowNull: false
        },
        employeeName: {
            type: DataTypes.STRING(100),
            field: 'nama_pegawai', // Database column: nama_pegawai
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING(20),
            field: 'jenis_kelamin', // Database column: jenis_kelamin
        },
        positionName: {
            type: DataTypes.STRING(50),
            field: 'nama_jabatan', // Database column: nama_jabatan
        },
        present: {
            type: DataTypes.INTEGER(11),
            field: 'hadir', // Database column: hadir
        },
        sick: {
            type: DataTypes.INTEGER(11),
            field: 'sakit', // Database column: sakit
        },
        absent: {
            type: DataTypes.INTEGER(11),
            field: 'alpha', // Database column: alpha
        },
    },{
        freezeTableName: true,
        tableName: 'data_kehadiran'
    });

export default Attendance