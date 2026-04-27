import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

// Salary Deduction model - maps to Indonesian database column 'deduction_salary'
// Field mapping: English property name -> Indonesian database column name
const SalaryDeduction = db.define('deduction_salary',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        deductionName: {
            type: DataTypes.STRING(120),
            field: 'potongan', // Database column: deduction
            allowNull: false
        },
        deductionAmount: {
            type: DataTypes.INTEGER(11),
            field: 'jml_potongan', // Database column: deductionAmount
            allowNull: false
        }
    },{
        freezeTableName: true,
        tableName: 'potongan_gaji'
    });

export default SalaryDeduction;