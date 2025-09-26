import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js";

export const register = async(req,res) => {
    try {
        const { username, email, password, dateOfBirth, dateOfJoining } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null
        });
        
        console.log("New User : ", newUser);
        await newUser.save();
        
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: {
                username: newUser.username,
                email: newUser.email,
                dateOfBirth: newUser.dateOfBirth,
                dateOfJoining: newUser.dateOfJoining
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: "Error registering user",
            message: error.message
        });
    }
}
export const authStatus = async (req,res) => {
    if(req.user){
        res.status(200).json({
            message: "User logged in successfully",
            username: req.user.username
        });
    }else{
        res.status(401).json({
            message: "Unauthorized user"
        });
    }
}
export const login = async(req,res) => {
    try {
        console.log("The authenticated user is : ", req.user);
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: req.user._id, 
                email: req.user.email,
                username: req.user.username 
            },
            process.env.JWT_SECRET || "my-jwt-secret",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "User logged in successfully",
            username: req.user.username,
            email: req.user.email,
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
export const logout = async(req,res) => {
    if(!req.user) res.status(401).json({message:"Unauthorized user"});
    req.logout((err)=>{
        if(err) return res.status(401).json({message:"Unauthorized user"});
        res.status(200).json({message: "Logout Successfull"})
    })
}

