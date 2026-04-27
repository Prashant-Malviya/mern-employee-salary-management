import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

// Salary Deduction model - maps to Indonesian database column 'potongan_gaji'
// Field mapping: English property name -> Indonesian database column name
const SalaryDeduction = db.define('potongan_gaji',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        deductionName: {
            type: DataTypes.STRING(120),
            field: 'potongan', // Database column: potongan
            allowNull: false
        },
        deductionAmount: {
            type: DataTypes.INTEGER(11),
            field: 'jml_potongan', // Database column: jml_potongan
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'potongan_gaji'
    });

export default SalaryDeduction;