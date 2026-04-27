import Employee from '../models/DataEmployeeModel.js'

export const verifyUser = async(req, res, next) =>{
    if(!req.session || !req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    try {
        const employee = await Employee.findOne({
            where: {
                employeeId: req.session.userId
            }
        });
        if(!employee) return res.status(404).json({msg: "User Not Found"});
        req.userId = employee.id;
        req.employeeId = employee.employeeId;
        req.role = employee.role;
        req.role = employee.role;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server Error Occurred" });
    }
}

export const adminOnly = async (req, res, next) => {
    try {
        if(!req.session || !req.session.userId){
            return res.status(401).json({msg: "Please login to your account!"});
        }

        const employee = await Employee.findOne({
            where:{
                employeeId: req.session.userId
            }
        });
        if(!employee) return res.status(404).json({msg: "Employee Data Not Found"});
        if(employee.role !== "admin") return res.status(403).json({msg: "Access denied"});
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server Error Occurred" });
    }
}
