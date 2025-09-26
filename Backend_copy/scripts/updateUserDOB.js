// Script to update specific user's date of birth
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

const updateUserDOB = async () => {
    try {
        await connectDB();
        
        const userEmail = 'eshani1@jio.com';
        const newDateOfBirth = '2002-05-19'; // Format: YYYY-MM-DD
        const newDateOfJoining = '2023-10-31'; // Format: YYYY-MM-DD
        
        console.log(`Updating user: ${userEmail}`);
        
        const user = await User.findOne({ email: userEmail });
        
        if (user) {
            // Update date of birth with proper date parsing
            user.dateOfBirth = new Date(newDateOfBirth);
            user.dateOfJoining = new Date(newDateOfJoining);
            
            // Validate dates
            if (isNaN(user.dateOfBirth.getTime())) {
                console.log('❌ Invalid date of birth format');
                return;
            }
            if (isNaN(user.dateOfJoining.getTime())) {
                console.log('❌ Invalid date of joining format');
                return;
            }
            
            await user.save();
            
            console.log(`✅ Updated ${userEmail}:`);
            console.log(`   - Date of Birth: ${user.dateOfBirth}`);
            console.log(`   - Date of Joining: ${user.dateOfJoining}`);
            
            // Calculate experience
            const joiningDate = new Date(user.dateOfJoining);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - joiningDate);
            const experience = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
            console.log(`   - Experience: ${experience} years`);
            
        } else {
            console.log(`❌ User not found: ${userEmail}`);
        }
        
    } catch (error) {
        console.error('Error updating user DOB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the script
updateUserDOB();
