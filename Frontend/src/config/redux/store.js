import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import dataSalaryEmployeePrintReducer from './reducer/dataSalaryEmployeePrintReducer';
import dataEmployeeReducer from './reducer/dataEmployeeReducer';
import dataPositionReducer from './reducer/dataPositionReducer';
import dataAttendanceReucer from './reducer/dataAttendanceReducer';
import dataDeductionReducer from './reducer/dataDeductionReducer';
import dataSalaryReducer from './reducer/dataSalaryReducer';
import reportAttendanceReducer from './reducer/reportAttendanceReducer';
import reportSalaryReducer from './reducer/reportSalaryReducer';
import slipSalaryReducer from './reducer/slipSalaryReducer';
import changePasswordReducer from './reducer/changePasswordReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        dataSalaryEmployeePrint: dataSalaryEmployeePrintReducer,
        dataEmployee: dataEmployeeReducer,
        dataPosition: dataPositionReducer,
        dataAttendance: dataAttendanceReucer,
        dataDeduction: dataDeductionReducer,
        dataSalary: dataSalaryReducer,
        reportAttendance: reportAttendanceReducer,
        reportSalary: reportSalaryReducer,
        slipSalary: slipSalaryReducer,
        changePassword: changePasswordReducer,
    },
});

export default store;
