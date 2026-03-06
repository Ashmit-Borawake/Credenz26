import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import { UserSignupSchema, UserLoginSchema } from "../types/event.types.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
    try {
        const parsed = UserSignupSchema.safeParse(req.body.user);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message });
        }
        const user = parsed.data;
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: user.username },
                    { email: user.email },
                    { phoneNumber: user.phoneNumber }
                ]
            }
        });
        if (existing) {
            return res.status(400).json({ error: "User already exists" });
        }
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
                profilePic: user.profilePic,
                isJunior: user.isJunior,
                otp: null,
                otpExpiration: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
};
export const login = async (req, res) => {
    try {
        const parsed = UserLoginSchema.safeParse(req.body.user);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message });
        }
        const user = parsed.data;
        const existing = await prisma.user.findFirst({
            where: {
                username: user.username
            }
        });
        if (!existing) {
            return res.status(400).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(user.password, existing.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ username: existing.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ token: token });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
};
//# sourceMappingURL=auth.js.map