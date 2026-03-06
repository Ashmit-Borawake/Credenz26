import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import { UserSignupSchema, UserLoginSchema } from "../types/event.types.js";
import crypto, { verify } from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendForgotPasswordEmail, sendSignUpEmail } from "../utils/email.js";

export const signup = async (req: Request, res: Response) => {
    try {
        console.log("SignUp : ",req.body.user.username)
        const parsed = UserSignupSchema.safeParse(req.body.user)
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message })
        }
        const user = parsed.data;

        if (user.phoneNumber.length != 10 || !/^\d{10}$/.test(user.phoneNumber)) {
            return res.status(400).json({ error: "Invalid phone number" })
        }
        
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: user.username },
                    { email: user.email },
                    { phoneNumber: user.phoneNumber }
                ]
            }
        });
        let same = []
        if (existing) {
            if (existing.username == user.username) {
                same.push(existing.username)
            }
            if (existing.phoneNumber === user.phoneNumber) {
                same.push(existing.phoneNumber)
            }
            if (existing.email === user.email) {
                same.push(existing.email)
            }
            return res.status(400).json({
                error: "Entered credentials are already in use",
                fields: same
            })
        }
        const profilePic = Math.floor(Math.random() * 5);
        const hash = await bcrypt.hash(user.password, 10);
        const userDB = await prisma.user.create({
            data: {
                id: uuidv4(),
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                password: hash,
                collegeName: user.collegeName,
                profilePic: profilePic,
                isJunior: user.isJunior,
                otp: null,
                otpExpiration: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        await sendSignUpEmail(userDB.email,"Welcome to Credenz'26","", userDB.username);

        return res.status(200).json({ message: "User created successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        console.log("Login : ",req.body.user.username)
        const parsed = UserLoginSchema.safeParse(req.body.user)
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message })
        }
        const user = parsed.data;
        const existing = await prisma.user.findFirst({
            where: {
                username: user.username
            }
        })
        if (!existing) {
            return res.status(400).json({ error: "User not found" })
        }
        const isMatch = await bcrypt.compare(user.password, existing.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" })
        }
        const token = jwt.sign({ username: existing.username, isJunior: existing.isJunior, userType: existing.userType,email:existing.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            
            httpOnly: true,
            secure: isProd,                      
            sameSite: isProd ? "none" : "lax",   
            maxAge: 24 *60 * 60 * 1000,
        });

        return res.status(200).json({ token: token,profilePic:existing.profilePic,message:"User Login Successfull" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const forgot = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const expire = parseInt(process.env.OTP_EXPIRATION || "10");
        const expiry = expire * 60000;
        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiration: new Date(Date.now() + expiry) }
        });
        await sendForgotPasswordEmail(user.email, user.username, otp, expire + " minutes");
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        if (!user.otpExpiration || user.otpExpiration < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }
        return res.status(200).json({isVerified:true, message: "OTP verified successfully" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export const reset = async (req: Request, res: Response) => {
    try {
        const {email,password } = req.body;
        
        const hash = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hash, otp: null, otpExpiration: null }
        });
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

// signup
//approve order
