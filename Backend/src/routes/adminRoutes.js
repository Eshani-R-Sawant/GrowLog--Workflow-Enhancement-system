import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { updateUserDates, getUserByEmail } from "../controller/adminController.js";

const router = Router();

// Simple admin authentication
const authenticateAdmin = async (req, res, next) => {
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
        console.error('Admin auth error:', error);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

// All admin routes require authentication
router.use(authenticateAdmin);

// Get user by email
router.get("/user/:email", getUserByEmail);

// Update user dates
router.put("/user/dates", updateUserDates);

export default router;



