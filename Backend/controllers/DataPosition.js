import Position from "../models/DataPositionModel.js";
import Employee from "../models/DataEmployeeModel.js";
import { Op } from "sequelize";

const formatPosition = (position) => {
    const data = position.toJSON ? position.toJSON() : position;

    return {
        ...data,
        id_position: data.positionId,
        nama_position: data.positionName,
        salary_pokok: data.baseSalary,
        transportAllowance: data.transportAllowance,
        mealAllowance: data.mealAllowance,
    };
};

const readPositionPayload = (body) => ({
    positionId: body.positionId || body.id_position,
    positionName: body.positionName || body.nama_position,
    baseSalary: body.baseSalary ?? body.salary_pokok,
    transportAllowance: body.transportAllowance ?? body.transportAllowance,
    mealAllowance: body.mealAllowance ?? body.mealAllowance,
});

const parsePositiveAmount = (value, label) => {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
        return { error: `${label} must be a positive number` };
    }

    return { value: amount };
};

const validatePositionPayload = (payload) => {
    if (!payload.positionName) {
        return { error: "Position name is required" };
    }

    const baseSalary = parsePositiveAmount(payload.baseSalary, "Base salary");
    if (baseSalary.error) return { error: baseSalary.error };

    const transportAllowance = parsePositiveAmount(payload.transportAllowance, "Transport allowance");
    if (transportAllowance.error) return { error: transportAllowance.error };

    const mealAllowance = parsePositiveAmount(payload.mealAllowance, "Meal allowance");
    if (mealAllowance.error) return { error: mealAllowance.error };

    return {
        value: {
            positionId: payload.positionId,
            positionName: payload.positionName,
            baseSalary: baseSalary.value,
            transportAllowance: transportAllowance.value,
            mealAllowance: mealAllowance.value,
        }
    };
};

// Get all positions
export const getDataPosition = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Position.findAll({
                attributes: ['id', 'positionName', 'baseSalary', 'transportAllowance', 'mealAllowance'],
                include: [{
                    model: Employee,
                    attributes: ['employeeName', 'username', 'role'],
                }]
            });
        } else {
            response = await Position.findAll({
                attributes: ['id', 'positionName', 'baseSalary', 'transportAllowance', 'mealAllowance'],
                where: {
                    userId: req.userId
                },
            });
        }
        res.status(200).json(response.map(formatPosition));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get position by ID
export const getDataPositionByID = async (req, res) => {
    try {
        const response = await Position.findOne({
            attributes: [
                'id', 'positionName', 'baseSalary', 'transportAllowance', 'mealAllowance'
            ],
            where: {
                id: req.params.id
            }
        });
        if(response){
            res.status(200).json(formatPosition(response));
        }else{
            res.status(404).json({msg: 'Position with this ID not found'});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Create new position
export const createDataPosition = async (req, res) => {
    const payload = readPositionPayload(req.body);
    const validation = validatePositionPayload(payload);

    if (validation.error) {
        return res.status(400).json({ msg: validation.error });
    }

    const {
        positionId, positionName, baseSalary, transportAllowance, mealAllowance
    } = validation.value;

    try {
        if (req.role === "admin") {
            await Position.create({
                positionId: positionId,
                positionName: positionName,
                baseSalary: baseSalary,
                transportAllowance: transportAllowance,
                mealAllowance: mealAllowance,
                userId: req.userId
            });
        } else {
            return res.status(403).json({ msg: "Access denied" });
        }
        res.status(201).json({ success: true, message: "Position Data Saved Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

// Update position data
export const updateDataPosition = async (req, res) => {
    try {
        const position = await Position.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!position) return res.status(404).json({ msg: "Data not found" });
        const validation = validatePositionPayload(readPositionPayload(req.body));

        if (validation.error) {
            return res.status(400).json({ msg: validation.error });
        }

        const { positionName, baseSalary, transportAllowance, mealAllowance } = validation.value;

        if (req.role === "admin") {
            await Position.update({
                positionName, baseSalary, transportAllowance, mealAllowance
            }, {
                where: {
                    id: position.id
                }
            });
        } else {
            if (req.userId !== Position.userId) return res.status(403).json({ msg: "Access denied" });
            await Position.update({
                positionName, baseSalary, transportAllowance, mealAllowance
            }, {
                where: {
                    [Op.and]: [{ positionId: position.positionId }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Position Data Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Delete position
export const deleteDataPosition = async (req, res) => {
    try {
        const position = await Position.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!position) return res.status(404).json({ msg: "Data not found" });
        if (req.role === "admin") {
            await position.destroy({
                where: {
                    id: position.id
                }
            });
        } else {
            if (req.userId !== position.userId) return res.status(403).json({ msg: "Access denied" });
            await position.destroy({
                where: {
                    [Op.and]: [{ positionId: position.positionId }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Position Data Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}
