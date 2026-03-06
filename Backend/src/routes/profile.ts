import { checkUsername, updateProfile, getProfile } from "../controllers/profile.js"
import express from "express";

const profileRouter = express.Router()

profileRouter.post("/check", checkUsername)
profileRouter.post("/update", updateProfile)
profileRouter.get("/", getProfile)

export { profileRouter }