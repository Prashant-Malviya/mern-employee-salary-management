import Employee from "../models/DataPegawaiModel.js";
import Attendance from "../models/DataKehadiranModel.js";
import { getDataGajiPegawai } from "./TransaksiController.js";
import { verifyUser } from "../middleware/AuthUser.js";

// Employee dashboard
export const dashboardPegawai = async (req, res) => {
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
export const viewDataGajiSinglePegawaiByMonth = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await Employee.findOne({
    where:{
      id: userId
    }
  });

  try {
      const salaryData = await getDataGajiPegawai();

      const attendanceResponse = await Attendance.findOne({
          attributes: [
              'bulan'
          ],
          where: {
              bulan: req.params.month
          }
      });

      if (attendanceResponse) {
        const salaryByMonth = salaryData.filter((salary) => {
          return salary.id === user.id && salary.bulan === attendanceResponse.bulan;
        }).map((salary) => {
          return {
            bulan: attendanceResponse.bulan,
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
export const viewDataGajiSinglePegawaiByYear = async (req, res) => {
  await verifyUser(req, res, () => {});

  const userId = req.userId;
  const user = await Employee.findOne({
    where:{
      id: userId
    }
  });

  try {
    const salaryData = await getDataGajiPegawai();
    const { year } = req.params;

    const salaryByYear = salaryData.filter((salary) => {
        return salary.id === user.id && salary.tahun === parseInt(year);
    }).map((salary) => {
        return {
            tahun: salary.tahun,
            bulan: salary.bulan,
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