import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { UpdateUserSchema } from "../types/event.types.js";

export const checkUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const existing = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if (existing) {
            return res.status(400).json({ error: "Username already exists" })
        }
        return res.status(200).json({ message: "Username is available" })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { username,_ } = req.user;

        if (!username || typeof username !== "string") {
            return res.status(400).json({ error: "Invalid or missing username" });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }
        return res.status(200).json({ user })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const currentUser = (req as any).user;
        if (!currentUser) {
            return res.status(400).json({ error: "Unauthorized" });
        }

        const parsed = UpdateUserSchema.safeParse(req.body.user)
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message })
        }

        const newData = parsed.data;

        // Check if username is being changed and if it is taken
        if (newData.username !== currentUser.username) {
            const taken = await prisma.user.findUnique({ where: { username: newData.username } });
            if (taken) return res.status(400).json({ error: "Username already taken" });
        }

        // Check email
        if (newData.email !== currentUser.email) {
            const taken = await prisma.user.findUnique({ where: { email: newData.email } });
            if (taken) return res.status(400).json({ error: "Can't update email" });
        }

        // Check phone
        if (newData.phoneNumber !== currentUser.phoneNumber) {
            const taken = await prisma.user.findUnique({ where: { phoneNumber: newData.phoneNumber } });
            if (taken) return res.status(400).json({ error: "Can't update phone number" });
        }


        const updatedUser = await prisma.user.update({
            where: {
                username: currentUser.username
            },
            data: {
                username: newData.username,
                firstName: newData.firstName,
                lastName: newData.lastName,
                email: newData.email,
                phoneNumber: newData.phoneNumber,
                collegeName: newData.collegeName,
                isJunior: newData.isJunior,
                updatedAt: new Date()
            }
        })
        return res.status(200).json({ user: updatedUser })
    }
    catch (error) {
        return res.status(500).json({ error: error })
    }
};