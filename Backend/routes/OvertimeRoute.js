import express from 'express';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';
import {
    createOvertime,
    getOvertime,
    updateOvertimeStatus
} from '../controllers/OvertimeController.js';

const router = express.Router();

router.post('/overtime', verifyUser, adminOnly, createOvertime);
router.get('/overtime', verifyUser, adminOnly, getOvertime);
router.patch('/overtime/:id/status', verifyUser, adminOnly, updateOvertimeStatus);

export default router;
