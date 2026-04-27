import { Op } from 'sequelize';
import Overtime from '../models/OvertimeModel.js';
import Employee from '../models/DataEmployeeModel.js';

const getLocalDate = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getDayEnd = (date) => {
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return dayEnd;
};

export const createOvertime = async (req, res) => {
    const { employee_id, date, hours, reason } = req.body;
    const overtimeReason = String(reason || '').trim();

    if (!employee_id || !date || !hours || !reason) {
        return res.status(400).json({ msg: 'All overtime fields are required' });
    }

    const overtimeHours = Number(hours);
    if (!Number.isInteger(overtimeHours) || overtimeHours < 1 || overtimeHours > 6) {
        return res.status(400).json({ msg: 'Overtime must be between 1-6 hours' });
    }

    const overtimeDate = getLocalDate(date);
    if (!overtimeDate) {
        return res.status(400).json({ msg: 'Invalid overtime date' });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (overtimeDate > today) {
        return res.status(400).json({ msg: 'Overtime date cannot be in the future' });
    }

    if (overtimeDate < sevenDaysAgo) {
        return res.status(400).json({ msg: 'Overtime date cannot be older than 7 days' });
    }

    if (overtimeReason.length < 10) {
        return res.status(400).json({ msg: 'Reason must be at least 10 characters' });
    }

    try {
        const employee = await Employee.findOne({
            where: {
                employeeId: employee_id
            }
        });

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        const dayStart = new Date(overtimeDate);
        const dayEnd = getDayEnd(overtimeDate);

        const duplicateOvertime = await Overtime.findOne({
            where: {
                employee_id,
                date: {
                    [Op.between]: [dayStart, dayEnd]
                }
            }
        });

        if (duplicateOvertime) {
            return res.status(400).json({ msg: 'Overtime already exists for this employee on this date' });
        }

        const monthStart = new Date(overtimeDate.getFullYear(), overtimeDate.getMonth(), 1);
        const monthEnd = new Date(overtimeDate.getFullYear(), overtimeDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const totalMonthlyHours = await Overtime.sum('hours', {
            where: {
                employee_id,
                date: {
                    [Op.between]: [monthStart, monthEnd]
                }
            }
        });

        if ((totalMonthlyHours || 0) + overtimeHours > 60) {
            return res.status(400).json({ msg: 'Monthly overtime limit is 60 hours per employee' });
        }

        const overtime = await Overtime.create({
            employee_id,
            date: overtimeDate,
            hours: overtimeHours,
            reason: overtimeReason
        });

        return res.status(201).json({ msg: 'Overtime created successfully', overtime });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const getOvertime = async (req, res) => {
    try {
        const overtimeEntries = await Overtime.findAll({
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });

        const employeeIds = [...new Set(overtimeEntries.map((entry) => entry.employee_id))];
        const employees = employeeIds.length
            ? await Employee.findAll({
                where: {
                    employeeId: {
                        [Op.in]: employeeIds
                    }
                },
                attributes: ['employeeId', 'employeeName', 'nationalId', 'position']
            })
            : [];

        const employeeMap = employees.reduce((map, employee) => {
            map[employee.employeeId] = employee.toJSON();
            return map;
        }, {});

        const response = overtimeEntries.map((entry) => ({
            ...entry.toJSON(),
            employee: employeeMap[entry.employee_id] || null
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const updateOvertimeStatus = async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid overtime status' });
    }

    try {
        const overtime = await Overtime.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!overtime) {
            return res.status(404).json({ msg: 'Overtime entry not found' });
        }

        await Overtime.update({
            status
        }, {
            where: {
                id: overtime.id
            }
        });

        return res.status(200).json({ msg: 'Overtime status updated successfully' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
