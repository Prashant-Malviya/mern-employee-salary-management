import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '../../components/molecules/NotFound'
import Home from '../../pages/Home';
import About from '../../pages/About';
import Contact from '../../pages/Contact';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';
import {
  FormAddDataPosition,
  FormEditDataPosition,
  FormAddDataAttendance,
  FormEditDataAttendance,
  FormAddDataEmployee,
  FormEditDataEmployee,
  FormAddDataDeduction,
  FormEditDataDeduction,
  PrintPdfReportSalary,
  DetailDataSalary,
  PrintPdfSlipSalary,
  PrintPdfReportAttendance,
  PrintPdfDataSalaryEmployee
} from '../../components';
import {
  DataEmployee,
  DataPosition,
  DataAttendance,
  DataSalary,
  ReportSalary,
  ReportAttendance,
  SlipSalary,
  ChangePasswordAdmin,
  DataSalaryEmployee,
  ChangePasswordEmployee,
  DataDeduction,
  OvertimeForm
} from '../../pages'

const AppRoutes = () => {
  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/tentang' element={<About />} />
      <Route path='/kontak' element={<Contact />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />

      {/* Route Admin */}
      {/* Master Data Admin */}
      <Route
        path='/data-employee'
        element={<DataEmployee />}
      />
      <Route
        path='/data-employee/form-data-employee/add'
        element={<FormAddDataEmployee />}
      />
      <Route
        path='/data-employee/form-data-employee/edit/:id'
        element={<FormEditDataEmployee />}
      />
      <Route
        path='/data-position'
        element={<DataPosition />}
      />
      <Route
        path='/data-position/form-data-position/add'
        element={<FormAddDataPosition />}
      />
      <Route
        path='/data-position/form-data-position/edit/:id'
        element={<FormEditDataPosition />}
      />

      {/* Transaction Admin */}
      <Route
        path='/data-attendance'
        element={<DataAttendance />}
      />
      <Route
        path='/data-attendance/form-data-attendance/add'
        element={<FormAddDataAttendance />}
      />
      <Route
        path='/data-attendance/form-data-attendance/edit/:id'
        element={<FormEditDataAttendance />}
      />
      <Route
        path='/data-deduction'
        element={<DataDeduction />}
      />
      <Route
        path='/data-deduction/form-data-deduction/add'
        element={<FormAddDataDeduction />} />
      <Route
        path='/data-deduction/form-data-deduction/edit/:id'
        element={<FormEditDataDeduction />} />
      <Route
        path='/data-salary'
        element={<DataSalary />}
      />
      <Route
        path='/overtime'
        element={<OvertimeForm />}
      />
      <Route
        path='/data-salary/detail-data-salary/name/:name'
        element={<DetailDataSalary />}
      />
      <Route
        path='/data-salary/cetak-salary/slip-salary/name/:name'
        element={<PrintPdfSlipSalary />}
      />

      {/* Report Admin */}
      <Route
        path='/report/salary'
        element={<ReportSalary />}
      />
      <Route
        path='/report/salary/print-page'
        element={<PrintPdfReportSalary />}
      />
      <Route
        path='/report/attendance'
        element={<ReportAttendance />}
      />
      <Route
        path='/report/attendance/print-page'
        element={<PrintPdfReportAttendance />}
      />
      <Route
        path='/report/slip-salary'
        element={<SlipSalary />}
      />
      <Route
        path='/report/slip-salary/print-page'
        element={<PrintPdfSlipSalary />}
      />

      {/* Settings Admin */}
      <Route
        path='/change-password'
        element={<ChangePasswordAdmin />}
      />

      {/* Route Employee */}
      {/* Dashboard Data Salary Employee */}
      <Route
        path='/data-salary-employee'
        element={<DataSalaryEmployee />}
      />
      <Route
        path='/data-salary-employee/print-page'
        element={<PrintPdfDataSalaryEmployee />}
      />
      <Route
        path='/change-password-employee'
        element={<ChangePasswordEmployee />}
      />

      {/* Route Not Found 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default AppRoutes;
