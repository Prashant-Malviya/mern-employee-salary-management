import Position from "../models/DataJabatanModel.js";
import Employee from "../models/DataPegawaiModel.js";
import { Op } from "sequelize";

// Get all positions
export const getDataJabatan = async (req, res) => {
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
            if (req.userId !== Position.userId) return res.status(403).json({ msg: "Access denied" });
            await Position.update({
                positionName, baseSalary, transportAllowance, mealAllowance
            }, {
                where: {
                    [Op.and]: [{ positionId: position.positionId }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get position by ID
export const getDataJabatanByID = async (req, res) => {
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
            res.status(200).json(response);
        }else{
            res.status(404).json({msg: 'Position with this ID not found'});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Create new position
export const createDataJabatan = async (req, res) => {
    const {
        positionId, positionName, baseSalary, transportAllowance, mealAllowance
    } = req.body;
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
            if (req.userId !== Position.userId) return res.status(403).json({ msg: "Access denied" });
            await Position.update({
                positionName, baseSalary, transportAllowance, mealAllowance
            }, {
                where: {
                    [Op.and]: [{ positionId: position.positionId }, { userId: req.userId }]
                },
            });
        }
        res.status(201).json({ success: true, message: "Position Data Saved Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

// Update position data
export const updateDataJabatan = async (req, res) => {
    try {
        const position = await Position.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!position) return res.status(404).json({ msg: "Data not found" });
        const { positionName, baseSalary, transportAllowance, mealAllowance } = req.body;
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
export const deleteDataJabatan = async (req, res) => {
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