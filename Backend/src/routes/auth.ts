import express from 'express'
import { signup, login, logout, forgot, reset, verifyOtp } from '../controllers/auth.js'
import { loginLimiter, signupLimiter } from '../config/rateLimit.js'
const authRouter = express.Router()

authRouter.post("/signup",signupLimiter, signup)
authRouter.post("/login",loginLimiter, login)
authRouter.post("/logout", logout)
authRouter.post("/forgot", forgot)
authRouter.post("/verifyOtp", verifyOtp)
authRouter.post("/reset", reset)

export { authRouter }