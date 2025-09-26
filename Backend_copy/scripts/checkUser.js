// Script to check user data in MongoDB
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

const checkUser = async () => {
    try {
        await connectDB();
        
        const userEmail = 'eshani1@jio.com';
        
        console.log(`Checking user: ${userEmail}`);
        
        const user = await User.findOne({ email: userEmail });
        
        if (user) {
            console.log(`✅ Found user: ${userEmail}`);
            console.log(`   - Username: ${user.username}`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Date of Birth: ${user.dateOfBirth}`);
            console.log(`   - Date of Joining: ${user.dateOfJoining}`);
            
            // Calculate experience
            if (user.dateOfJoining) {
                const joiningDate = new Date(user.dateOfJoining);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - joiningDate);
                const experience = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
                console.log(`   - Experience: ${experience} years`);
            }
            
        } else {
            console.log(`❌ User not found: ${userEmail}`);
        }
        
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the script
checkUser();



