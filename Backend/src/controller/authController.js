import bcrypt from "bcryptjs"
import User from "../models/user.js";

export const register = async(req,res) => {
    try {
        const { username,email,password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User ({
            username,
            password: hashedPassword,
            email,
        });
        console.log("New User : ",newUser);
        await newUser.save();
        res.status(201).json({message:"User Registered Successfully"});
    } catch (error) {
        res.status(500).json({error: "Error registering user", message:error})
        console.log(error);
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
    console.log("The authenticated used is : ", req.user);
    res.status(200).json({
        message: "User logged in successfully",
        username: req.user.username
    });
}
export const logout = async(req,res) => {
    if(!req.user) res.status(401).json({message:"Unauthorized user"});
    req.logout((err)=>{
        if(err) return res.status(401).json({message:"Unauthorized user"});
        res.status(200).json({message: "Logout Successfull"})
    })
}

