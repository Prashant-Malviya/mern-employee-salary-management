import DataEmployee from './DataEmployeeModel.js';
import DataPosition from './DataPositionModel.js';
import DataAttendance from './DataAttendanceModel.js';

/* Method untuk mengambil Employee Data */

async function getDataEmployee() {
    try {
        const dataEmployee = await DataEmployee.findAll();
        const dataEmployeeMap = new Map();
        dataEmployee.forEach(employee => {
            const {nationalId, employeeName, position} = employee;
            dataEmployeeMap.set(employeeName, {nationalId, position});
        });

        const resultDataEmployee = [];
        dataEmployeeMap.forEach(({nationalId, position}, employeeName) => {
            resultDataEmployee.push({nationalId, employeeName, position});
        });

        const data_employeeName = resultDataEmployee.map(employee => employee.employeeName);
        const data_nik = resultDataEmployee.map(employee => employee.nationalId);
        const data_position = resultDataEmployee.map(employee => employee.position);

        return { data_employeeName, data_nik, data_position };
    } catch (error) {
        console.log(error);
    }
}

/* Method untuk mengambil Attendance Data */

async function getDataAttendance() {
    try {
    const dataAttendance = await DataAttendance.findAll();
    const dataAttendanceMap = new Map();

    const { data_employeeName } = await getDataEmployee();
    const { data_nik } = await getDataEmployee();

    dataAttendance.forEach(attendance => {
        const { nationalId, month, gender, nama_position, present, sick, absent } = attendance;
        const employeeName = data_employeeName.find(nama => nama === attendance.employeeName) || "-";
        const nik_employee = data_nik.find(nationalId => nationalId === attendance.nationalId) || "-";
        dataAttendanceMap.set(nik_employee, { employeeName, month, gender, nama_position, present, sick, absent });
    });

    const resultDataAttendance = [];
    dataAttendanceMap.forEach(({ nationalId, month, gender, nama_position, present, sick, absent }, nikEmployee) => {
        const employeeName = data_employeeName.find(nama => nama === dataAttendanceMap.get(nikEmployee).employeeName) || "-";
        resultDataAttendance.push({ employeeName, nationalId, month, gender, nama_position, present, sick, absent });
    });

    console.log(resultDataAttendance);

    } catch (error) {
    console.log(error);
    }
}

getDataAttendance();



/* Method untuk mengambil Employee Data */

async function getDataPosition() {
    const dataPosition = await DataPosition.findAll();
    const datapositionMap = new Map();
    try {
        dataPosition.forEach(position => {
            const {nama_position, salary_pokok, transportAllowance, mealAllowance} = position;
            datapositionMap.set(nama_position, {salary_pokok, transportAllowance, mealAllowance});
        });

        const resultDataposition = [];
        datapositionMap.forEach(({salary_pokok, transportAllowance, mealAllowance}, nama_position) => {
            resultDataposition.push({nama_position, salary_pokok, transportAllowance, mealAllowance});
        });

        return resultDataposition;
    } catch (error) {
        console.log(error);
    }
}