import Attendance from "../models/DataAttendanceModel.js";
import Employee from "../models/DataEmployeeModel.js";
import Position from "../models/DataPositionModel.js";
import SalaryDeduction from "../models/DeductionSalaryModel.js";
import moment from "moment";
import "moment/locale/id.js";

const formatDeduction = (deduction) => {
  const data = deduction.toJSON ? deduction.toJSON() : deduction;

  return {
    ...data,
    deduction: data.deductionName,
    deductionAmount: data.deductionAmount,
  };
};

const readDeductionPayload = (body) => ({
  id: body.id,
  deductionName: body.deductionName || body.deduction,
  deductionAmount: body.deductionAmount ?? body.deductionAmount,
});

const validatePositiveAmount = (value, label) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: `${label} must be a positive number` };
  }

  return { value: amount };
};

const validateDeductionPayload = (payload) => {
  if (!payload.deductionName) {
    return { error: "Deduction name is required" };
  }

  const deductionAmount = validatePositiveAmount(payload.deductionAmount, "Deduction amount");
  if (deductionAmount.error) return { error: deductionAmount.error };

  return {
    value: {
      id: payload.id,
      deductionName: payload.deductionName,
      deductionAmount: deductionAmount.value,
    }
  };
};

// Get all attendance data
export const viewDataAttendance = async (req, res) => {
  let resultDataAttendance = [];
  try {
    // Get attendance data
    const attendanceData = await Attendance.findAll({
      attributes: [
        "id",
        "month",
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

    resultDataAttendance = attendanceData.map((attendance) => {
      const id = attendance.id;
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.month;
      const nationalId = attendance.nationalId;
      const employeeName = attendance.employeeName;
      const employeePosition = attendance.positionName;
      const gender = attendance.gender;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        id,
        month: month,
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
    res.json(resultDataAttendance);
  } catch (error) {
    console.log(error);
  }
};

// Get attendance by ID
export const viewDataAttendanceByID = async (req, res) => {
  try {
    const attendanceData = await Attendance.findOne({
      attributes: [
        "id",
        "month",
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
export const createDataAttendance = async (req, res) => {
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
        month: month.toLowerCase(),
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
export const updateDataAttendance = async (req, res) => {
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
export const deleteDataAttendance = async (req, res) => {
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
export const createDataDeductionSalary = async (req, res) => {
  const validation = validateDeductionPayload(readDeductionPayload(req.body));

  if (validation.error) {
    return res.status(400).json({ msg: validation.error });
  }

  const { id, deductionName, deductionAmount } = validation.value;

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
        deductionAmount: deductionAmount,
      });
      res.json({
        msg: "Add Salary Deduction Data Successful",
        message: "Add Salary Deduction Data Successful",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all salary deductions
export const viewDataDeduction = async (req, res) => {
  try {
    const deductionData = await SalaryDeduction.findAll({
      attributes: ["id", "deductionName", "deductionAmount"],
    });
    res.json(deductionData.map(formatDeduction));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get salary deduction by ID
export const viewDataDeductionByID = async (req, res) => {
  try {
    const deductionData = await SalaryDeduction.findOne({
      attributes: ["id", "deductionName", "deductionAmount"],
      where: {
        id: req.params.id,
      },
    });
    if (!deductionData) {
      return res.status(404).json({ msg: "Deduction data not found" });
    }

    res.json(formatDeduction(deductionData));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update salary deduction
export const updateDataDeduction = async (req, res) => {
  try {
    const validation = validateDeductionPayload(readDeductionPayload(req.body));

    if (validation.error) {
      return res.status(400).json({ msg: validation.error });
    }

    const { deductionName, deductionAmount } = validation.value;

    await SalaryDeduction.update({
      deductionName,
      deductionAmount,
    }, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      msg: "Deduction data updated successfully",
      message: "Deduction data updated successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Delete salary deduction
export const deleteDataDeduction = async (req, res) => {
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
export const getDataEmployee = async () => {
  let resultDataEmployee = [];

  try {
    // Get employee data
    const employeeData = await Employee.findAll({
      attributes: ["id", "nationalId", "employeeName", "gender", "position"],
      distinct: true,
    });

    resultDataEmployee = employeeData.map((employee) => {
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

  return resultDataEmployee;
};

// Get position data
export const getDataPosition = async () => {
  let resultDataPosition = [];
  try {
    // Get position data
    const positionData = await Position.findAll({
      attributes: ["positionName", "baseSalary", "transportAllowance", "mealAllowance"],
      distinct: true,
    });

    resultDataPosition = positionData.map((position) => {
      const positionName = position.positionName;
      const baseSalary = position.baseSalary;
      const transportAllowance = position.transportAllowance;
      const mealAllowance = position.mealAllowance;

      return { positionName, baseSalary, transportAllowance, mealAllowance };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDataPosition;
};

// Get attendance data
export const getDataAttendance = async () => {
  try {
    // Get attendance data
    const attendanceData = await Attendance.findAll({
      attributes: [
        "month",
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

    const resultDataAttendance = attendanceData.map((attendance) => {
      const createdAt = new Date(attendance.createdAt);
      const year = createdAt.getFullYear();
      const month = attendance.month;
      const nationalId = attendance.nationalId;
      const employeeName = attendance.employeeName;
      const employeePosition = attendance.positionName;
      const present = attendance.present;
      const sick = attendance.sick;
      const absent = attendance.absent;

      return {
        month: month,
        tahun: year,
        nationalId,
        employeeName,
        employeePosition,
        present,
        sick,
        absent,
      };
    });
    return resultDataAttendance;
  } catch (error) {
    console.error(error);
  }
};

export const getDataDeduction = async () => {
  let resultDataDeduction = [];
  try {
    // Get deduction data
    const deductionData = await SalaryDeduction.findAll({
      attributes: ["id", "deductionName", "deductionAmount"],
      distinct: true,
    });
    resultDataDeduction = deductionData.map((deduction) => {
      const id = deduction.id;
      const deductionName = deduction.deductionName;
      const deductionAmount = deduction.deductionAmount;

      return { id, deductionName, deductionAmount };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDataDeduction;
};

// Salary calculation logic
export const getDataSalaryEmployee = async () => {
  try {
    // Employee Salary
    const resultDataEmployee = await getDataEmployee();
    const resultDataPosition = await getDataPosition();

    const employeeSalary = resultDataEmployee
      .filter((employee) =>
        resultDataPosition.some(
          (position) => position.positionName === employee.employeePosition
        )
      )
      .map((employee) => {
        const position = resultDataPosition.find(
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
    const resultDataAttendance = await getDataAttendance();
    const resultDataDeduction = await getDataDeduction();

    const employeeDeductions = resultDataAttendance.map((attendance) => {
      const absentDeduction = attendance.absent > 0 ?
        resultDataDeduction
          .filter((deduction) => deduction.deductionName.toLowerCase() === "absent")
          .reduce((total, deduction) => total + deduction.deductionAmount * attendance.absent, 0) : 0;

      const sickDeduction = attendance.sick > 0 ?
        resultDataDeduction
          .filter((deduction) => deduction.deductionName.toLowerCase() === "sick")
          .reduce((total, deduction) => total + deduction.deductionAmount * attendance.sick, 0) : 0;

      return {
        tahun: attendance.tahun,
        month: attendance.month,
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
      const attendance = resultDataAttendance.find(
        (attendance) => attendance.employeeName === employee.employeeName
      );
      const deduction = employeeDeductions.find(
        (deduction) => deduction.employeeName === employee.employeeName
      );
      const totalSalary =
      (employee.baseSalary +
      employee.transportAllowance +
      employee.mealAllowance -
      (deduction ? deduction.totalDeduction : 0)).toLocaleString();

      return {
        tahun: deduction ? deduction.tahun : attendance ? attendance.tahun : 0,
        month: deduction ? deduction.month : attendance ? attendance.month : 0,
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
        total: totalSalary,
      };
    });
    return totalSalary;
  } catch (error) {
    console.error(error);
  }
};

// View employee salary data
export const viewDataSalaryEmployee = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee();
    res.status(200).json(salaryData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const viewDataSalaryEmployeeByName = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee();
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
          month: salary.month,
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
export const viewDataSalaryById = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee(req, res);
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
export const viewDataSalaryByName = async (req, res) => {
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



// View employee salary by month
export const viewDataSalaryEmployeeByMonth = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee();
    const response = await Attendance.findOne({
      attributes: ["month"],
      where: {
        month: req.params.month,
      },
    });

    if (response) {
      const salaryByMonth = salaryData
        .filter((salary) => {
          return salary.month === response.month;
        })
        .map((salary) => {
          return {
            month: response.month,
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
export const viewDataSalaryEmployeeByYear = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee();
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
export const dataReportSalaryByYear = async (req, res) => {
  try {
    const salaryData = await getDataSalaryEmployee();
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
      const reportByYear = salaryByYear.map((data) => data.tahun)
      console.log(reportByYear)
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
