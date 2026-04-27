import {
    getDataSalaryEmployee,
    getDataAttendance,
    viewDataSalaryEmployeeByYear
} from "./TransactionController.js"

// View salary report
export const viewReportSalaryEmployee = async(req, res) => {
    try {
        const salaryReport = await getDataSalaryEmployee(req, res);
        res.status(200).json(salaryReport);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// View salary report by month
export const viewReportSalaryEmployeeByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const salaryDataByMonth = await getDataSalaryEmployee(req, res);

        const filteredData = salaryDataByMonth.filter((data) => {
            return data.month.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    month: data.month,
                    employeeName: data.employeeName,
                    position: data.employeePosition,
                    baseSalary: data.baseSalary,
                    transportAllowance: data.transportAllowance,
                    mealAllowance: data.mealAllowance,
                    deduction: data.deduction,
                    totalSalary: data.total
                };
            });
            res.json(formattedData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// View salary report by year
export const viewReportSalaryEmployeeByYear = async (req, res) => {
    try {
         await viewDataSalaryEmployeeByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// View salary report by name
export const viewReportSalaryEmployeeByName = async (req, res) => {
    try {
        const salaryData = await getDataSalaryEmployee(req, res);
        const name = req.params.name.toLowerCase();

        const foundData = salaryData.filter((data) => {
          const formattedName = data.employeeName.toLowerCase();
          const searchKeywords = name.split(" ");

          return searchKeywords.every((keyword) => formattedName.includes(keyword));
        });

        if (foundData.length === 0) {
          res.status(404).json({ msg: "Data not found" });
        } else {
          res.json(foundData);
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
      }
  };

// View attendance report by month (using dropdown)
export const viewReportAttendanceEmployeeByMonth = async (req, res) => {
    try {
        const attendanceDataByMonth = await getDataAttendance();
        const { month } = req.params;

        const attendanceData = attendanceDataByMonth.filter((attendance) => attendance.month.toLowerCase() === month.toLowerCase()).map((attendance) => {
            return {
                tahun: attendance.year,
                month: attendance.month,
                nationalId: attendance.nationalId,
                employeeName: attendance.employeeName,
                employeePosition: attendance.employeePosition,
                present: attendance.present,
                sick: attendance.sick,
                absent: attendance.absent
            };
        });

        if (attendanceData.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            res.json(attendanceData);
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


// View attendance report by year
export const viewReportAttendanceEmployeeByYear = async (req, res) => {
    try {
        const attendanceDataByYear = await getDataAttendance();
        const { year } = req.params;

        const attendanceData = attendanceDataByYear.filter((attendance) => attendance.tahun.toString() === year.toString()).map((attendance) => {
            return {
                tahun: attendance.year,
                month: attendance.month,
                nationalId: attendance.nationalId,
                employeeName: attendance.employeeName,
                employeePosition: attendance.employeePosition,
                present: attendance.present,
                sick: attendance.sick,
                absent: attendance.absent
            };
        });

        if (attendanceData.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            res.json(attendanceData);
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// View Salary Slip by Name
export const viewSlipSalaryByName = async (req, res) => {
    try {
        const salaryData = await getDataSalaryEmployee(req, res);
        const name = req.params.name.toLowerCase();

        const foundData = salaryData.filter((data) => {
          const formattedName = data.employeeName.toLowerCase();
          const searchKeywords = name.split(" ");

          return searchKeywords.every((keyword) => formattedName.includes(keyword));
        });

        if (foundData.length === 0) {
          res.status(404).json({ msg: "Data not found" });
        } else {
          res.json(foundData);
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
      }
}

// View Salary Slip by Month
export const viewSlipSalaryByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const salaryDataByMonth = await getDataSalaryEmployee(req, res);

        const filteredData = salaryDataByMonth.filter((data) => {
            return data.month.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: `Data for month ${month} not found` });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    month: data.month,
                    tahun: data.tahun,
                    employeeName: data.employeeName,
                    position: data.position,
                    baseSalary: data.baseSalary,
                    transportAllowance: data.transportAllowance,
                    mealAllowance: data.mealAllowance,
                    deduction: data.deduction,
                    totalSalary: data.total
                };
            });
            res.json(formattedData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// View Salary Slip by Year
export const viewSlipSalaryByYear = async (req, res) => {
    try {
        await viewDataSalaryEmployeeByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}