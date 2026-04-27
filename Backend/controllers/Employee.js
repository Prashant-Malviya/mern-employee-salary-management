import Employee from "../models/DataEmployeeModel.js";
import Attendance from "../models/DataAttendanceModel.js";
import { getDataSalaryEmployee } from "./TransactionController.js";
import { verifyUser } from "../middleware/AuthUser.js";

// Employee dashboard
export const dashboardEmployee = async (req, res) => {
    await verifyUser(req, res, () => {});

    const userId = req.userId;

    const response = await Employee.findOne({
      where:{
        id: userId
      },
      attributes: [
        'id', 'nationalId', 'employeeName',
        'gender', 'position', 'joinDate',
        'status', 'photo', 'role'
      ]
    });

    res.status(200).json(response);
  };

// View single employee salary by month
export const viewDataSalarySingleEmployeeByMonth = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await Employee.findOne({
    where:{
      id: userId
    }
  });

  try {
      const salaryData = await getDataSalaryEmployee();

      const attendanceResponse = await Attendance.findOne({
          attributes: [
              'month'
          ],
          where: {
              month: req.params.month
          }
      });

      if (attendanceResponse) {
        const salaryByMonth = salaryData.filter((salary) => {
          return salary.id === user.id && salary.month === attendanceResponse.month;
        }).map((salary) => {
          return {
            month: attendanceResponse.month,
            tahun: salary.tahun,
            nationalId: user.nationalId,
            employeeName: user.employeeName,
            gender: user.gender,
            position: user.position,
            baseSalary: salary.baseSalary,
            transportAllowance: salary.transportAllowance,
            mealAllowance: salary.mealAllowance,
            deduction: salary.deduction,
            totalSalary: salary.total,
          };
        });
          return res.json(salaryByMonth);
      }

      res.status(404).json({ msg: `Salary Data for Month ${req.params.month} Not Found for Employee ${user.employeeName}` });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// View single employee salary by year
export const viewDataSalarySingleEmployeeByYear = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await Employee.findOne({
    where:{
      id: userId
    }
  });

  try {
    const salaryData = await getDataSalaryEmployee();
    const { year } = req.params;

    const salaryByYear = salaryData.filter((salary) => {
        return salary.id === user.id && salary.tahun === parseInt(year);
    }).map((salary) => {
        return {
            tahun: salary.tahun,
            month: salary.month,
            nationalId: user.nationalId,
            employeeName: user.employeeName,
            gender: user.gender,
            position: user.position,
            baseSalary: salary.baseSalary,
            transportAllowance: salary.transportAllowance,
            mealAllowance: salary.mealAllowance,
            deduction: salary.deduction,
            totalSalary: salary.total,
        };
    });

    if (salaryByYear.length === 0) {
        return res.status(404).json({ msg: `Data for Year ${year} Not Found` });
    }
    res.json(salaryByYear)
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Data displayed (Month/Year, Base Salary, Transport Allowance, Meal Allowance, Deductions, Total Salary)