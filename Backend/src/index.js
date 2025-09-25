import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import "./config/passportConfig.js";

dotenv.config();
dbConnect();


const app=express();


//Middlewares

//allowing cross origin request\

const corsOptions = {
    origin: ["http://localhost:5173"],
    credential:true,
}

express.json({limit:"100mb"})
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:60000 * 60,
    }
}));
app.use(urlencoded({limit:"100mb", extended: true}));
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/task",taskRoutes);

//Listen app
const PORT = process.env.PORT || 7002;
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})


