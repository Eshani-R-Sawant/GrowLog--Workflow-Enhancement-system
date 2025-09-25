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
export const authStatus = () => {

}
export const login = () => {

}
export const logout = () => {

}

