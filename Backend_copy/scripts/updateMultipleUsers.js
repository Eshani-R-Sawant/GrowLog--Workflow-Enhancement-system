// Script to update multiple users' dates at once
import mongoose from 'mongoose';
import User from '../src/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const updateMultipleUsers = async () => {
    try {
        await connectDB();
        
        // Array of users to update
        const usersToUpdate = [
            {
                email: 'eshani1@jio.com',
                dateOfBirth: '2002-05-19',
                dateOfJoining: '2025-10-31'
            },
            {
                email: 'eshani@jio.com',
                dateOfBirth: '1995-03-15',
                dateOfJoining: '2020-06-01'
            }
            // Add more users here as needed
        ];
        
        console.log(`Updating ${usersToUpdate.length} users...`);
        
        for (const userData of usersToUpdate) {
            try {
                const user = await User.findOne({ email: userData.email });
                
                if (user) {
                    // Update dates
                    user.dateOfBirth = new Date(userData.dateOfBirth);
                    user.dateOfJoining = new Date(userData.dateOfJoining);
                    
                    // Validate dates
                    if (isNaN(user.dateOfBirth.getTime()) || isNaN(user.dateOfJoining.getTime())) {
                        console.log(`❌ Invalid date format for ${userData.email}`);
                        continue;
                    }
                    
                    await user.save();
                    
                    console.log(`✅ Updated ${userData.email}:`);
                    console.log(`   - Date of Birth: ${user.dateOfBirth.toDateString()}`);
                    console.log(`   - Date of Joining: ${user.dateOfJoining.toDateString()}`);
                    
                    // Calculate experience
                    const joiningDate = new Date(user.dateOfJoining);
                    const currentDate = new Date();
                    const diffTime = Math.abs(currentDate - joiningDate);
                    const experience = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
                    console.log(`   - Experience: ${experience} years`);
                    
                } else {
                    console.log(`❌ User not found: ${userData.email}`);
                }
                
            } catch (error) {
                console.error(`Error updating ${userData.email}:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the script
updateMultipleUsers();



