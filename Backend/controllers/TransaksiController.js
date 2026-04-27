import Attendance from "../models/DataKehadiranModel.js";
import Employee from "../models/DataPegawaiModel.js";
import Position from "../models/DataJabatanModel.js";
import SalaryDeduction from "../models/PotonganGajiModel.js";
import moment from "moment";
import "moment/locale/id.js";

// Get all attendance data
export const viewDataKehadiran = async (req, res) => {
  let resultDataKehadiran = [];
  try {
    // Get attendance data
    const attendanceData = await Attendance.findAll({
      attributes: [
        "id",
        "bulan",
        "nationalId",
        "employeeName",
        "gender",
        "positionName",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      distinct: true,
    });

    resultDataKehadiran = attendanceData.map((attendance) => {
      const id = attendance.id;
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.bulan;
      const nationalId = attendance.nationalId;
      const employeeName = attendance.employeeName;
      const employeePosition = attendance.positionName;
      const gender = attendance.gender;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        id,
        bulan: month,
        tahun: year,
        nationalId,
        employeeName,
        employeePosition,
        gender,
        present,
        sick,
        absent,
      };
    });
    res.json(resultDataKehadiran);
  } catch (error) {
    console.log(error);
  }
};

// Get attendance by ID
export const viewDataKehadiranByID = async (req, res) => {
  try {
    const attendanceData = await Attendance.findOne({
      attributes: [
        "id",
        "bulan",
        "nationalId",
        "employeeName",
        "gender",
        "positionName",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      where: {
        id: req.params.id,
      }
    });
    res.json(attendanceData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create new attendance
export const createDataKehadiran = async (req, res) => {
  const {
    nationalId,
    employeeName,
    positionName,
    gender,
    present,
    sick,
    absent,
  } = req.body;

  try {
    const employeeData = await Employee.findOne({
      where: {
        employeeName: employeeName,
      },
    });

    const positionData = await Position.findOne({
      where: {
        positionName: positionName,
      },
    });

    const employeeNikData = await Employee.findOne({
      where: {
        nationalId: nationalId,
      },
    });

    const existingAttendance = await Attendance.findOne({
      where: {
        employeeName: employeeName,
      },
    });

    if (!employeeData) {
      return res.status(404).json({ msg: "Employee name data not found" });
    }

    if (!positionData) {
      return res.status(404).json({ msg: "Position name data not found" });
    }

    if (!employeeNikData) {
      return res.status(404).json({ msg: "National ID data not found" });
    }

    if (!existingAttendance) {
      const month = moment().locale("id").format("MMMM");
      await Attendance.create({
        bulan: month.toLowerCase(),
        nationalId: nationalId,
        employeeName: employeeData.employeeName,
        gender: gender,
        positionName: positionData.positionName,
        present: present,
        sick: sick,
        absent: absent,
      });
      res.json({ msg: "Add Attendance Data Successful" });
    } else {
      res.status(400).json({ msg: "Employee name already exists" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update attendance data
export const updateDataKehadiran = async (req, res) => {
  try {
    await Attendance.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Attendance data updated successfully" });
  } catch (error) {
    console.log(error.msg);
  }
};

// Delete attendance data
export const deleteDataKehadiran = async (req, res) => {
  try {
    await Attendance.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Delete data successful" });
  } catch (error) {
    console.log(error.msg);
  }
};

// Create salary deduction
export const createDataPotonganGaji = async (req, res) => {
  const { id, deductionName, deductionAmount } = req.body;
  try {
    const existingDeduction = await SalaryDeduction.findOne({
      where: {
        deductionName: deductionName,
      },
    });
    if (existingDeduction) {
      res.status(400).json({ msg: "Deduction data already exists!" });
    } else {
      await SalaryDeduction.create({
        id: id,
        deductionName: deductionName,
        deductionAmount: deductionAmount.toLocaleString(),
      });
      res.json({ msg: "Add Salary Deduction Data Successful" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Get all salary deductions
export const viewDataPotongan = async (req, res) => {
  try {
    const deductionData = await SalaryDeduction.findAll({
      attributes: ["id", "deductionName", "deductionAmount"],
    });
    res.json(deductionData);
  } catch (error) {
    console.log(error);
  }
};

// Get salary deduction by ID
export const viewDataPotonganByID = async (req, res) => {
  try {
    const deductionData = await SalaryDeduction.findOne({
      attributes: ["id", "deductionName", "deductionAmount"],
      where: {
        id: req.params.id,
      },
    });
    res.json(deductionData);
  } catch (error) {
    console.log(error);
  }
};

// Update salary deduction
export const updateDataPotongan = async (req, res) => {
  try {
    await SalaryDeduction.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Deduction data updated successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

// Delete salary deduction
export const deleteDataPotongan = async (req, res) => {
  try {
    await SalaryDeduction.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Delete data successful" });
  } catch (error) {
    console.log(error.message);
  }
};

// Get employee data
export const getDataPegawai = async () => {
  let resultDataPegawai = [];

  try {
    // Get employee data
    const employeeData = await Employee.findAll({
      attributes: ["id", "nationalId", "employeeName", "gender", "position"],
      distinct: true,
    });

    resultDataPegawai = employeeData.map((employee) => {
      const id = employee.id;
      const nationalId = employee.nationalId;
      const employeeName = employee.employeeName;
      const gender = employee.gender;
      const employeePosition = employee.position;

      return { id, nationalId, employeeName, gender, employeePosition };
    });
  } catch (error) {
    console.error(error);
  }

  return resultDataPegawai;
};

// Get position data
export const getDataJabatan = async () => {
  let resultDataJabatan = [];
  try {
    // Get position data
    const positionData = await Position.findAll({
      attributes: ["positionName", "baseSalary", "transportAllowance", "mealAllowance"],
      distinct: true,
    });

    resultDataJabatan = positionData.map((position) => {
      const positionName = position.positionName;
      const baseSalary = position.baseSalary;
      const transportAllowance = position.transportAllowance;
      const mealAllowance = position.mealAllowance;

      return { positionName, baseSalary, transportAllowance, mealAllowance };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDataJabatan;
};

// Get attendance data
export const getDataKehadiran = async () => {
  try {
    // Get attendance data
    const attendanceData = await Attendance.findAll({
      attributes: [
        "bulan",
        "nationalId",
        "employeeName",
        "gender",
        "positionName",
        "present",
        "sick",
        "absent",
        "createdAt",
      ],
      distinct: true,
    });

    const resultDataKehadiran = attendanceData.map((attendance) => {
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.bulan;
      const nationalId = attendance.nationalId;
      const employeeName = attendance.employeeName;
      const employeePosition = attendance.positionName;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        bulan: month,
        tahun: year,
        nationalId,
        employeeName,
        employeePosition,
        present,
        sick,
        absent,
      };
    });
    return resultDataKehadiran;
  } catch (error) {
    console.error(error);
  }
};

export const getDataPotongan = async () => {
  let resultDataPotongan = [];
  try {
    // Get deduction data
    const deductionData = await SalaryDeduction.findAll({
      attributes: ["id", "deductionName", "deductionAmount"],
      distinct: true,
    });
    resultDataPotongan = deductionData.map((deduction) => {
      const id = deduction.id;
      const deductionName = deduction.deductionName;
      const deductionAmount = deduction.deductionAmount;

      return { id, deductionName, deductionAmount };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDataPotongan;
};

// Salary calculation logic
export const getDataGajiPegawai = async () => {
  try {
    // Employee Salary
    const resultDataPegawai = await getDataPegawai();
    const resultDataJabatan = await getDataJabatan();

    const employeeSalary = resultDataPegawai
      .filter((employee) =>
        resultDataJabatan.some(
          (position) => position.positionName === employee.employeePosition
        )
      )
      .map((employee) => {
        const position = resultDataJabatan.find(
          (position) => position.positionName === employee.employeePosition
        );
        return {
          id: employee.id,
          nationalId: employee.nationalId,
          employeeName: employee.employeeName,
          position: employee.employeePosition,
          baseSalary: position.baseSalary,
          transportAllowance: position.transportAllowance,
          mealAllowance: position.mealAllowance,
        };
      });

    // Employee Deductions
    const resultDataKehadiran = await getDataKehadiran();
    const resultDataPotongan = await getDataPotongan();

    const employeeDeductions = resultDataKehadiran.map((attendance) => {
      const absentDeduction = attendance.absent > 0 ?
        resultDataPotongan
          .filter((deduction) => deduction.deductionName.toLowerCase() === "absent")
          .reduce((total, deduction) => total + deduction.deductionAmount * attendance.absent, 0) : 0;

      const sickDeduction = attendance.sick > 0 ?
        resultDataPotongan
          .filter((deduction) => deduction.deductionName.toLowerCase() === "sick")
          .reduce((total, deduction) => total + deduction.deductionAmount * attendance.sick, 0) : 0;

      return {
        tahun: attendance.tahun,
        bulan: attendance.bulan,
        employeeName: attendance.employeeName,
        present: attendance.present,
        sick: attendance.sick,
        absent: attendance.absent,
        sickDeduction: sickDeduction,
        absentDeduction: absentDeduction,
        totalDeduction: sickDeduction + absentDeduction
      };
    });

    // Total Employee Salary
    const totalSalary = employeeSalary.map((employee) => {
      const id = employee.id;
      const attendance = resultDataKehadiran.find(
        (attendance) => attendance.employeeName === employee.employeeName
      );
      const deduction = employeeDeductions.find(
        (deduction) => deduction.employeeName === employee.employeeName
      );
      const totalGaji =
      (employee.baseSalary +
      employee.transportAllowance +
      employee.mealAllowance -
      (deduction ? deduction.totalDeduction : 0)).toLocaleString();

      return {
        tahun: deduction ? deduction.tahun : attendance ? attendance.tahun : 0,
        bulan: deduction ? deduction.bulan : attendance ? attendance.bulan : 0,
        id: id,
        nationalId: employee.nationalId,
        employeeName: employee.employeeName,
        position: employee.position,
        baseSalary: employee.baseSalary.toLocaleString(),
        transportAllowance: employee.transportAllowance.toLocaleString(),
        mealAllowance: employee.mealAllowance.toLocaleString(),
        present: attendance.present,
        sick: attendance.sick,
        absent: attendance.absent,
        deduction: deduction ? deduction.totalDeduction.toLocaleString() : 0,
        total: totalGaji,
      };
    });
    return totalSalary;
  } catch (error) {
    console.error(error);
  }
};

// View employee salary data
export const viewDataGajiPegawai = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai();
    res.status(200).json(salaryData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const viewDataGajiPegawaiByName = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai();
    const { name } = req.params;

    const salaryByName = salaryData
      .filter((salary) => {
        return salary.employeeName
          .toLowerCase()
          .includes(name.toLowerCase().replace(/ /g, ""));
      })
      .map((salary) => {
        return {
          tahun: salary.tahun,
          bulan: salary.bulan,
          id: salary.id,
          nationalId: salary.nationalId,
          employeeName: salary.employeeName,
          position: salary.position,
          gender: salary.gender,
          employeePosition: salary.employeePosition,
          baseSalary: salary.baseSalary,
          transportAllowance: salary.transportAllowance,
          mealAllowance: salary.mealAllowance,
          deduction: salary.deduction,
          totalSalary: salary.total,
        };
      });

    if (salaryByName.length === 0) {
      return res.status(404).json({ msg: 'Data not found' });
    }
    return res.json(salaryByName);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// View employee salary by ID
export const viewDataGajiById = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai(req, res);
    const id = parseInt(req.params.id);

    const foundData = salaryData.find((data) => data.id === id);

    if (!foundData) {
      res.status(404).json({ msg: "Data not found" });
    } else {
      res.json(foundData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// View employee salary by Name
export const viewDataGajiByName = async (req, res) => {
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



// View employee salary by month
export const viewDataGajiPegawaiByMonth = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai();
    const response = await Attendance.findOne({
      attributes: ["bulan"],
      where: {
        bulan: req.params.month,
      },
    });

    if (response) {
      const salaryByMonth = salaryData
        .filter((salary) => {
          return salary.bulan === response.bulan;
        })
        .map((salary) => {
          return {
            bulan: response.bulan,
            id: salary.id,
            nationalId: salary.nationalId,
            employeeName: salary.employeeName,
            gender: salary.gender,
            employeePosition: salary.employeePosition,
            baseSalary: salary.baseSalary,
            transportAllowance: salary.transportAllowance,
            mealAllowance: salary.mealAllowance,
            deduction: salary.deduction,
            totalSalary: salary.total,
          };
        });
      return res.json(salaryByMonth);
    }

    res
      .status(404)
      .json({ msg: `Data for month ${req.params.month} not found` });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View employee salary by year
export const viewDataGajiPegawaiByYear = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai();
    const { year } = req.params;

    const salaryByYear = salaryData
      .filter((salary) => {
        const salaryYear = salary.tahun;
        return salaryYear === parseInt(year);
      })
      .map((salary) => {
        return {
          tahun: salary.tahun,
          id: salary.id,
          nationalId: salary.nationalId,
          employeeName: salary.employeeName,
          gender: salary.gender,
          employeePosition: salary.position,
          present: salary.present,
          sick: salary.sick,
          absent: salary.absent,
          baseSalary: salary.baseSalary,
          transportAllowance: salary.transportAllowance,
          mealAllowance: salary.mealAllowance,
          deduction: salary.deduction,
          totalSalary: salary.total,
        };
      });

    if (salaryByYear.length === 0) {
      return res
        .status(404)
        .json({ msg: `Data for year ${year} not found` });
    }
    res.json(salaryByYear);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View salary report by year
export const dataLaporanGajiByYear = async (req, res) => {
  try {
    const salaryData = await getDataGajiPegawai();
    const { year } = req.params;

    const salaryByYear = salaryData
      .filter((salary) => {
        const salaryYear = salary.tahun;
        return salaryYear === parseInt(year);
      })
      .map((salary) => {
        return {
          tahun: salary.tahun,
          id: salary.id,
          nationalId: salary.nationalId,
          employeeName: salary.employeeName,
          gender: salary.gender,
          employeePosition: salary.employeePosition,
          baseSalary: salary.baseSalary,
          transportAllowance: salary.transportAllowance,
          mealAllowance: salary.mealAllowance,
          deduction: salary.deduction,
          totalSalary: salary.total,
        };
      });

    if (salaryByYear.length === 0) {
      return res
        .status(404)
        .json({ msg: `Data for year ${year} not found` });
    } else {
      const laporanByYear = salaryByYear.map((data) => data.tahun)
      console.log(laporanByYear)
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};