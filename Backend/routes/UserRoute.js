import express from 'express';

/* === import Middleware === */
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

/* === import Controllers === */
import {
    getDataEmployee,
    getDataEmployeeByID,
    createDataEmployee,
    updateDataEmployee,
    deleteDataEmployee,
    getDataEmployeeByNik,
    getDataEmployeeByName,
} from '../controllers/DataEmployee.js';

import {
    getDataPosition,
    createDataPosition,
    updateDataPosition,
    deleteDataPosition,
    getDataPositionByID
} from "../controllers/DataPosition.js";

import {
    viewDataAttendance,
    createDataAttendance,
    updateDataAttendance,
    deleteDataAttendance,
    viewDataAttendanceByID,
    viewDataSalaryByName,
} from "../controllers/TransactionController.js";

import {
    createDataDeductionSalary,
    deleteDataDeduction,
    viewDataDeductionByID,
    updateDataDeduction,
    viewDataDeduction
} from "../controllers/TransactionController.js";

import {
    viewDataSalaryEmployee,
    viewDataSalaryEmployeeByMonth,
    viewDataSalaryEmployeeByYear
} from "../controllers/TransactionController.js";

import {
    viewReportAttendanceEmployeeByMonth,
    viewReportAttendanceEmployeeByYear,
    viewReportSalaryEmployee,
    viewReportSalaryEmployeeByMonth,
    viewReportSalaryEmployeeByName,
    viewReportSalaryEmployeeByYear,
    viewSlipSalaryByMonth,
    viewSlipSalaryByName,
    viewSlipSalaryByYear,
} from "../controllers/ReportController.js";

import { LogOut, changePassword } from '../controllers/Auth.js';
import {
    dashboardEmployee,
    viewDataSalarySingleEmployeeByMonth,
    viewDataSalarySingleEmployeeByYear
} from '../controllers/Employee.js';

const router = express.Router();

// Admin Route :

/* ==== Master Data ==== */
// Employee Data
router.get('/employeeData', verifyUser, adminOnly, getDataEmployee);
router.get('/employeeData/id/:id', verifyUser, adminOnly, getDataEmployeeByID);
router.get('/employeeData/nationalId/:nationalId', verifyUser, adminOnly, getDataEmployeeByNik);
router.get('/employeeData/name/:name', verifyUser, getDataEmployeeByName);
router.post('/employeeData',verifyUser, adminOnly, createDataEmployee);
router.patch('/employeeData/:id', verifyUser, adminOnly, updateDataEmployee);
router.delete('/employeeData/:id', verifyUser, adminOnly, deleteDataEmployee);
router.patch('/employeeData/:id/change_password', verifyUser, adminOnly, changePassword);
// Data Position
router.get('/data_position', verifyUser, adminOnly, getDataPosition);
router.get('/data_position/:id', verifyUser, adminOnly, getDataPositionByID);
router.post('/data_position', verifyUser, adminOnly, createDataPosition);
router.patch('/data_position/:id', verifyUser, adminOnly, updateDataPosition);
router.delete('/data_position/:id', verifyUser, adminOnly, deleteDataPosition);

/* ==== Transaction  ==== */
// Attendance Data
router.get('/data_attendance', verifyUser, adminOnly, viewDataAttendance);
router.get('/data_attendance/:id', verifyUser, adminOnly, viewDataAttendanceByID);
router.post('/data_attendance',verifyUser, adminOnly, createDataAttendance);
router.patch('/data_attendance/update/:id',verifyUser, adminOnly, updateDataAttendance);
router.delete('/data_attendance/:id', verifyUser, adminOnly, deleteDataAttendance);
// Data Deduction
router.get('/data_deduction', adminOnly, verifyUser, viewDataDeduction);
router.get('/data_deduction/:id', adminOnly, verifyUser, viewDataDeductionByID);
router.post('/data_deduction', adminOnly, verifyUser, createDataDeductionSalary);
router.patch('/data_deduction/update/:id', adminOnly, verifyUser, updateDataDeduction);
router.delete('/data_deduction/:id', adminOnly, verifyUser, deleteDataDeduction);
// Data Salary
router.get('/data_salary_employee', viewDataSalaryEmployee);
router.get('/data_salary/name/:name', verifyUser, viewDataSalaryByName);
router.get('/data_salary_employee/month/:month', viewDataSalaryEmployeeByMonth);
router.get('/data_salary_employee/year/:year', viewDataSalaryEmployeeByYear);

/* ====  Report  ==== */
// report Salary Employee
router.get('/report/salary',verifyUser, adminOnly, viewReportSalaryEmployee);
router.get('/report/salary/name/:name',verifyUser, adminOnly, viewReportSalaryEmployeeByName);
router.get('/report/salary/month/:month', verifyUser, adminOnly,viewReportSalaryEmployeeByMonth);
router.get('/report/salary/year/:year', verifyUser, adminOnly,viewReportSalaryEmployeeByYear);
// Report Attendance Employee
router.get('/report/attendance/month/:month', verifyUser, adminOnly,viewReportAttendanceEmployeeByMonth);
router.get('/report/attendance/year/:year', verifyUser, adminOnly,viewReportAttendanceEmployeeByYear);
// Slip Salary Employee
router.get('/report/slip_salary/name/:name', verifyUser, adminOnly,viewSlipSalaryByName);
router.get('/report/slip_salary/month/:month',verifyUser, adminOnly, viewSlipSalaryByMonth);
router.get('/report/slip_salary/year/:year',verifyUser, adminOnly, viewSlipSalaryByYear);

/* ==== Change Password ==== */
router.patch('/change_password', verifyUser, changePassword);

/* ==== Logout ==== */
router.delete('/logout', LogOut);

// Employee Route :
/* ==== Dashboard ==== */
router.get('/dashboard', verifyUser, dashboardEmployee);
/* ==== Data Salary ==== */
router.get('/data_salary/month/:month', verifyUser, viewDataSalarySingleEmployeeByMonth);
router.get('/data_salary/year/:year', verifyUser, viewDataSalarySingleEmployeeByYear);
/* ==== Change Password ==== */
router.patch('/change_password', verifyUser, changePassword);
/* ==== Logout ==== */
router.delete('/logout', LogOut);


export default router;