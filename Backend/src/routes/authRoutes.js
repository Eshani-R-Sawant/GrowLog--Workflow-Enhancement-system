import { Router } from "express";
import passport from "passport";
import { register,login,logout,authStatus } from "../controller/authController.js";

const router = Router();

//route for signup
router.post("/register", register);

//route for login
router.post("/login",passport.authenticate("local"),login);

//route for status
router.get("/status", authStatus);

//route for logout
router.post("/logout", logout);

export default router;