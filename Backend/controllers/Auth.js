import Employee from "../models/DataEmployeeModel.js";
import argon2 from "argon2";

const formatEmployeeAuth = (employee) => ({
  id: employee.id,
  employeeId: employee.employeeId,
  nationalId: employee.nationalId,
  employeeName: employee.employeeName,
  username: employee.username,
  role: employee.role,
  role: employee.role
});

export const Login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  try {
    const employee = await Employee.findOne({
      where: {
        username
      }
    });

    if (!employee) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const match = await argon2.verify(employee.password || "", password);

    if (!match) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    req.session.userId = employee.employeeId;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ msg: "Unable to save login session" });
      }

      return res.status(200).json({
        ...formatEmployeeAuth(employee),
        msg: "Login Successful"
      });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please login to your account!" });
  }

  try {
    const employee = await Employee.findOne({
      attributes: ['id', 'employeeId', 'nationalId', 'employeeName', 'username', 'role'],
      where: {
        employeeId: req.session.userId
      }
    });

    if (!employee) return res.status(404).json({ msg: "User Not Found" });

    return res.status(200).json(formatEmployeeAuth(employee));
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Cannot logout" });
    res.status(200).json({ msg: "You Have Logged Out" });
  });
}

export const changePassword = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Please login to your account!" });
  }

  const user = await Employee.findOne({
    where: {
      id: userId
    }
  });

  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  }

  const { password, confPassword } = req.body;

  if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

  try {
    const hashPassword = await argon2.hash(password);

    await Employee.update(
      {
        password: hashPassword
      },
      {
        where: {
          id: user.id
        }
      }
    )
    res.status(200).json({ msg: "Password Updated Successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
