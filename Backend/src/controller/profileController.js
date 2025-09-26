import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Get user profile data
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate experience based on date of joining
        let experience = 0;
        if (user.dateOfJoining) {
            const joiningDate = new Date(user.dateOfJoining);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - joiningDate);
            experience = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // Years
        }

        // No task statistics needed for profile

        const profileData = {
            // Non-editable fields (from database)
            username: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            dateOfJoining: user.dateOfJoining,
            experience: experience,
            createdAt: user.createdAt,
            
            // Editable fields
            manager: user.manager || '',
            domain: user.domain || '',
            team: user.team || '',
            role: user.role || '',
            bio: user.bio || '',
            phone: user.phone || '',
            location: user.location || '',
            avatarDataUrl: user.avatarDataUrl || '',
            
            // No task statistics needed for profile
        };

        res.status(200).json({
            success: true,
            data: profileData
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update user profile (only editable fields)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { manager, domain, team, role, bio, phone, location, avatarDataUrl } = req.body;

        // Only allow updating specific fields
        const updateData = {};
        if (manager !== undefined) updateData.manager = manager;
        if (domain !== undefined) updateData.domain = domain;
        if (team !== undefined) updateData.team = team;
        if (role !== undefined) updateData.role = role;
        if (bio !== undefined) updateData.bio = bio;
        if (phone !== undefined) updateData.phone = phone;
        if (location !== undefined) updateData.location = location;
        if (avatarDataUrl !== undefined) updateData.avatarDataUrl = avatarDataUrl;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const Task = (await import('../models/task.js')).default;
        
        // Get task statistics for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const taskStats = await Task.aggregate([
            { 
                $match: { 
                    userId: userId,
                    createdAt: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    completedTasks: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    averageProductivity: {
                        $avg: {
                            $cond: [
                                { $eq: ['$status', 'completed'] },
                                100,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const stats = taskStats[0] || {
            totalTasks: 0,
            completedTasks: 0,
            averageProductivity: 0
        };

        res.status(200).json({
            success: true,
            data: {
                last30Days: stats,
                productivity: Math.round(stats.averageProductivity || 0)
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};
