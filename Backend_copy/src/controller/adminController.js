import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Update specific user's date of birth and joining
export const updateUserDates = async (req, res) => {
    try {
        const { email, dateOfBirth, dateOfJoining } = req.body;
        
        if (!email || !dateOfBirth || !dateOfJoining) {
            return res.status(400).json({
                success: false,
                message: 'email, dateOfBirth, and dateOfJoining are required'
            });
        }

        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update dates
        user.dateOfBirth = new Date(dateOfBirth);
        user.dateOfJoining = new Date(dateOfJoining);
        
        await user.save();

        // Calculate experience
        const joiningDate = new Date(user.dateOfJoining);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - joiningDate);
        const experience = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

        res.status(200).json({
            success: true,
            message: 'User dates updated successfully',
            data: {
                email: user.email,
                username: user.username,
                dateOfBirth: user.dateOfBirth,
                dateOfJoining: user.dateOfJoining,
                experience: experience
            }
        });
    } catch (error) {
        console.error('Update user dates error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user dates',
            error: error.message
        });
    }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const user = await User.findOne({ email: email }).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};



