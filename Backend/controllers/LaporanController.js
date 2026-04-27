import {
    getDataGajiPegawai,
    getDataKehadiran,
    viewDataGajiPegawaiByYear
} from "./TransaksiController.js"

// View salary report
export const viewLaporanGajiPegawai = async(req, res) => {
    try {
        const salaryReport = await getDataGajiPegawai(req, res);
        res.status(200).json(salaryReport);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// View salary report by month
export const viewLaporanGajiPegawaiByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const salaryDataByMonth = await getDataGajiPegawai(req, res);

        const filteredData = salaryDataByMonth.filter((data) => {
            return data.bulan.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: 'Data not found' });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    bulan: data.bulan,
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
export const viewLaporanGajiPegawaiByYear = async (req, res) => {
    try {
         await viewDataGajiPegawaiByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// View salary report by name
export const viewLaporanGajiPegawaiByName = async (req, res) => {
    try {
        const salaryData = await getDataGajiPegawai(req, res);
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
export const viewLaporanAbsensiPegawaiByMonth = async (req, res) => {
    try {
        const attendanceDataByMonth = await getDataKehadiran();
        const { month } = req.params;

        const attendanceData = attendanceDataByMonth.filter((attendance) => attendance.bulan.toLowerCase() === month.toLowerCase()).map((attendance) => {
            return {
                tahun: attendance.year,
                bulan: attendance.bulan,
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
export const viewLaporanAbsensiPegawaiByYear = async (req, res) => {
    try {
        const attendanceDataByYear = await getDataKehadiran();
        const { year } = req.params;

        const attendanceData = attendanceDataByYear.filter((attendance) => attendance.tahun.toString() === year.toString()).map((attendance) => {
            return {
                tahun: attendance.year,
                bulan: attendance.bulan,
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
export const viewSlipGajiByName = async (req, res) => {
    try {
        const salaryData = await getDataGajiPegawai(req, res);
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
export const viewSlipGajiByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        const salaryDataByMonth = await getDataGajiPegawai(req, res);

        const filteredData = salaryDataByMonth.filter((data) => {
            return data.bulan.toLowerCase() === month.toLowerCase();
        });

        if (filteredData.length === 0) {
            res.status(404).json({ msg: `Data for month ${month} not found` });
        } else {
            const formattedData = filteredData.map((data) => {
                return {
                    bulan: data.bulan,
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
export const viewSlipGajiByYear = async (req, res) => {
    try {
        await viewDataGajiPegawaiByYear(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}