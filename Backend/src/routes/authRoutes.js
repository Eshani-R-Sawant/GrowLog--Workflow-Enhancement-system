import { Router } from "express";
import passport from "passport";
import { register,login,logout,authStatus } from "../controller/authController.js";

const router = Router();

//route for signup
router.post("/register", register);

//route for login
router.post("/login", login);

//route for status
router.post("/status", authStatus);

//route for logout
router.post("/logout", logout);

export default router;