import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { 
    getTasksByDate, 
    createTask, 
    updateTaskStatus, 
    deleteTask, 
    getAllUserTasks 
} from "../controller/taskController.js";

const router = Router();

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-jwt-secret');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

// All task routes require authentication
router.use(authenticateToken);

// Get tasks for a specific date
router.get("/date/:date", getTasksByDate);

// Create a new task
router.post("/", createTask);

// Update task status (move between columns)
router.put("/:taskId/status", updateTaskStatus);

// Delete a task
router.delete("/:taskId", deleteTask);

// Get all user tasks (with pagination)
router.get("/", getAllUserTasks);

export default router;
