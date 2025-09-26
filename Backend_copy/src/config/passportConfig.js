import passport from "passport";
import {Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


passport.use(new LocalStrategy(
    {usernameField: "email"},
    async function(email, password, done) {
        try{
            const user = await User.findOne({email});
            if(!user) return done(null,false,{message:"User not found"});
            const isMatch = await bcrypt.compare(password,user.password);
            if(isMatch) return done(null,user);
            else return done(null,false,{message:"Incorrect Password"});
        }catch(error){
            return done(error);
        }
    }
));

passport.serializeUser((user,done)=>{
    console.log("Serialize User");
    done(null,user._id);
});

passport.deserializeUser(async (_id,done)=>{
    try {
        console.log("Deserialize User");
        const user = await User.findById(_id);
        done(null,user._id);
    } catch (error) {
        done(error);
    }
    
});