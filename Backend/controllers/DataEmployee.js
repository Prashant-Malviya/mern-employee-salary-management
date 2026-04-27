import Employee from "../models/DataEmployeeModel.js";
import argon2 from "argon2";
import path from "path";

const DESIGNATION_OPTIONS = ["Mason", "Electrician", "Plumber", "Supervisor", "Helper"];

const formatEmployee = (employee) => {
    const data = employee.toJSON ? employee.toJSON() : employee;

    return {
        ...data,
        employeeId: data.employeeId,
        nationalId: data.nationalId,
        employeeName: data.employeeName,
        gender: data.gender,
        position: data.position,
        designation: data.designation,
        joinDate: data.joinDate,
        role: data.role,
        role: data.role
    };
};

const getEmployeePayload = (body) => ({
    nationalId: body.nationalId,
    employeeName: body.employeeName,
    username: body.username,
    gender: body.gender,
    position: body.position,
    designation: body.designation,
    joinDate: body.joinDate,
    status: body.status,
    role: body.role
});

const isValidDesignation = (designation) => DESIGNATION_OPTIONS.includes(designation);

// Get all employees
export const getDataEmployee = async (req, res) => {
    try {
        const response = await Employee.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(response.map(formatEmployee));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get employee by ID
export const getDataEmployeeByID = async (req, res) => {
    try {
        const response = await Employee.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(formatEmployee(response));
        } else {
            res.status(404).json({ msg: 'Employee with this ID not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get employee by National ID (National ID)
export const getDataEmployeeByNik = async (req, res) => {
    try {
        const response = await Employee.findOne({
            attributes: { exclude: ['password'] },
            where: {
                nationalId: req.params.nationalId
            }
        });
        if (response) {
            res.status(200).json(formatEmployee(response));
        } else {
            res.status(404).json({ msg: 'Employee with this National ID not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// Get employee by Name
export const getDataEmployeeByName = async (req, res) => {
    try {
        const response = await Employee.findOne({
            attributes: { exclude: ['password'] },
            where: {
                employeeName: req.params.name
            }
        });
        if (response) {
            res.status(200).json(formatEmployee(response));
        } else {
            res.status(404).json({ msg: 'Employee with this name not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Create new employee
export const createDataEmployee = async (req, res) => {
    const {
        nationalId, employeeName, username,
        gender, position, designation, joinDate, status, role
    } = getEmployeePayload(req.body);
    const { password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    if (!nationalId || !employeeName || !username || !password || !gender || !position || !designation || !joinDate || !status || !role) {
        return res.status(400).json({ msg: "All employee fields are required" });
    }

    if (!isValidDesignation(designation)) {
        return res.status(400).json({ msg: "Designation must be Mason, Electrician, Plumber, Supervisor, or Helper" });
    }

    if (!req.files || !req.files.photo) {
        return res.status(400).json({ msg: "Photo upload failed. Please upload photo again" });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid photo file format" });
    }

    if (fileSize > 2000000) {
        return res.status(422).json({ msg: "Image size must be less than 2 MB" });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        const hashPassword = await argon2.hash(password);

        try {
            await Employee.create({
                nationalId: nationalId,
                employeeName: employeeName,
                username: username,
                password: hashPassword,
                gender: gender,
                position: position,
                designation: designation,
                joinDate: joinDate,
                status: status,
                photo: fileName,
                url: url,
                role: role
            });

            res.status(201).json({ success: true, message: "Registration Successful" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    });
};


// Update employee data
export const updateDataEmployee = async (req, res) => {
    const employee = await Employee.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!employee) return res.status(404).json({ msg: "Employee data not found" });
    const {
        nationalId, employeeName, username,
        gender, position, designation, joinDate, status, role
    } = getEmployeePayload(req.body);

    if (!nationalId || !employeeName || !username || !gender || !position || !designation || !joinDate || !status || !role) {
        return res.status(400).json({ msg: "All employee fields are required" });
    }

    if (!isValidDesignation(designation)) {
        return res.status(400).json({ msg: "Designation must be Mason, Electrician, Plumber, Supervisor, or Helper" });
    }

    try {
        await Employee.update({
            nationalId: nationalId,
            employeeName: employeeName,
            username: username,
            gender: gender,
            position: position,
            designation: designation,
            joinDate: joinDate,
            status: status,
            role: role
        }, {
            where: {
                id: employee.id
            }
        });
        res.status(200).json({ msg: "Employee Data Updated Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

// Change employee password (admin function)
export const changePasswordAdmin = async (req, res) => {
    const employee = await Employee.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!employee) return res.status(404).json({ msg: "Employee data not found" });


    const { password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

    try {
        if (employee.role === "employee") {
            const hashPassword = await argon2.hash(password);

            await Employee.update(
                {
                    password: hashPassword
                },
                {
                    where: {
                        id: employee.id
                    }
                }
            );

            res.status(200).json({ msg: "Employee Password Updated Successfully" });
        } else {
            res.status(403).json({ msg: "Forbidden" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// Delete employee
export const deleteDataEmployee = async (req, res) => {
    const employee = await Employee.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!employee) return res.status(404).json({ msg: "Employee data not found" });
    try {
        await Employee.destroy({
            where: {
                id: employee.id
            }
        });
        res.status(200).json({ msg: "Employee Data Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
