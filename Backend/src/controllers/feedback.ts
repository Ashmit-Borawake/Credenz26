import type { Request, Response } from "express";
import { FeedbackSchema } from "../types/event.types.js";
import { prisma } from "../config/db.js";

export const getFeedback = async (req: Request, res: Response) => {
    try {
        const parsed = FeedbackSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message });
        }
        const feedback = parsed.data;
        const feedbackDB = await prisma.contact.create({
            data: feedback,
        });
        return res.status(200).json({ message: "Feedback added successfully" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}