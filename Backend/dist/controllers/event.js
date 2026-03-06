import { prisma } from '../config/db.js';
import { EventSchema, UpdateEventSchema } from '../types/event.types.js';
export const addEvent = async (req, res) => {
    try {
        const parsed = EventSchema.safeParse(req.body.event);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message });
        }
        const evenDetails = parsed.data;
        const event = await prisma.event.create({
            data: evenDetails
        });
        return res.status(201).json({ "message": "Event Created Successfully", "event": event });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
export const updateEvent = async (req, res) => {
    try {
        const eventID = req.params.id;
        const parsed = UpdateEventSchema.safeParse(req.body.event);
        const eventDetails = JSON.parse(JSON.stringify(parsed.data));
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message });
        }
        if (Object.keys(eventDetails).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }
        await prisma.event.update({
            where: { id: eventID },
            data: eventDetails,
        });
        return res.status(200).json({ message: "Event updated successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getEvent = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                type: true,
            },
        });
        return res.status(200).json({ "events": events });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
//# sourceMappingURL=event.js.map