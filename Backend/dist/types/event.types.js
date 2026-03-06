import * as z from "zod";
export const EventSchema = z.object({
    title: z.string(),
    slug: z.string(),
    type: z.enum(["TECH", "NON_TECH", "PASS"]),
    price: z.number().int(),
    maxTeamSize: z.number().int().positive()
});
export const UpdateEventSchema = z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    type: z.enum(["TECH", "NON_TECH", "PASS"]).optional(),
    price: z.number().int().positive().optional(),
    maxTeamSize: z.number().int().optional()
});
export const CartSchema = z.object({
    eventID: z.uuid(),
    teamname: z.string().optional(),
    username2: z.string().optional(),
    username3: z.string().optional(),
    username4: z.string().optional(),
});
export const UpdateCartSchema = z.object({
    teamname: z.string().optional(),
    username2: z.string().optional(),
    username3: z.string().optional(),
    username4: z.string().optional(),
});
export const UserSignupSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(20),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(10),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    collegeName: z.string().min(3).max(20),
    profilePic: z.number().int().min(0).optional().default(0),
    isJunior: z.boolean(),
});
export const UserLoginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(20),
});
//# sourceMappingURL=event.types.js.map