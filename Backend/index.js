import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import argon2 from 'argon2';

import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';
import Employee from './models/DataEmployeeModel.js';

import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import OvertimeRoute from './routes/OvertimeRoute.js';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESS_SECRET || process.env.JWT_SECRET || 'employee-salary-session-secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);
app.use(OvertimeRoute);

const ensureDefaultAdmin = async () => {
    const employeeCount = await Employee.count();

    if (employeeCount > 0) return;

    const hashPassword = await argon2.hash('123456');
    await Employee.create({
        nationalId: '0000000000000001',
        employeeName: 'Admin',
        username: 'admin',
        password: hashPassword,
        gender: 'Laki-Laki',
        position: 'Administrator',
        joinDate: new Date().toISOString().slice(0, 10),
        status: 'karyawan tetap',
        photo: 'default.png',
        url: '',
        role: 'admin'
    });

    console.log('Default admin created: username=admin password=123456');
};

const startServer = async () => {
    try {
        await db.sync({ alter: true });
        await store.sync();
        await ensureDefaultAdmin();

        app.listen(process.env.APP_PORT, () => {
            console.log('Server up and running...');
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
};

startServer();
