import * as z from "zod"


export const UserSignupSchema = z.object({
    username: z
        .string("Username is required")
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username must not exceed 20 characters"),

    password: z
        .string("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must not exceed 20 characters"),

    email: z
        .string("Email is required")
        .email("Please enter a valid email address"),

    phoneNumber: z
        .string("Phone number is required")
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only digits"),

    firstName: z
        .string("First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(20, "First name must not exceed 20 characters"),

    lastName: z
        .string("Last name is required")
        .min(2, "Last name must be at least 2 characters long")
        .max(20, "Last name must not exceed 20 characters"),

    collegeName: z
        .string()
        .min(2, "College name must be at least 2 characters long")
        .max(200, "College name must not exceed 200 characters"),

    isJunior: z.boolean(
        "Please specify whether you are a junior",
    ),
});

export const UserLoginSchema = z.object({
    username: z
        .string("Username is required")
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username must not exceed 20 characters"),

    password: z
        .string("Password is required"),
});


export const UpdateUserSchema = z.object({
    username: z
        .string("Username is required")
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username must not exceed 20 characters"),

    firstName: z
        .string("First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(20, "First name must not exceed 20 characters"),

    lastName: z
        .string("Last name is required")
        .min(2, "Last name must be at least 2 characters long")
        .max(20, "Last name must not exceed 20 characters"),

    email: z
        .string("Email is required")
        .email("Please enter a valid email address"),

    phoneNumber: z
        .string("Phone number is required")
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only digits"),

    collegeName: z
        .string("College name is required")
        .min(2, "College name must be at least 2 characters long")
        .max(20, "College name must not exceed 20 characters"),

    isJunior: z.boolean(
        "Please specify whether you are a junior",
    ),
});


export const EventSchema = z.object({
    title: z
        .string("Event title is required"),

    slug: z
        .string("Event slug is required"),

    type: z.enum(["TECH", "NON_TECH", "PASS"],
        "Event type is required",
    ),

    price: z
        .number("Price is required")
        .int("Price must be an integer"),

    maxTeamSize: z
        .number("Max team size is required")
        .int("Max team size must be an integer")
        .positive("Max team size must be greater than 0"),
});


export const UpdateEventSchema = z.object({
    title: z.string().optional(),

    slug: z.string().optional(),

    type: z.enum(["TECH", "NON_TECH", "PASS"]).optional(),

    price: z
        .number()
        .int("Price must be an integer")
        .positive("Price must be positive")
        .optional(),

    maxTeamSize: z
        .number()
        .int("Max team size must be an integer")
        .optional(),
});


export const CartSchema = z.object({
    eventSlug: z
        .string("Event slug is required"),

    teamname: z.string().optional(),

    username2: z.string().optional(),
    username3: z.string().optional(),
    username4: z.string().optional(),
});

export const AdminCartSchema = z.object({
    eventSlug: z
        .string("Event slug is required"),

    teamname: z.string().optional(),

    username1: z
        .string("Username1 is required"),

    username2: z.string().optional(),
    username3: z.string().optional(),
    username4: z.string().optional(),
});

export const UpdateCartSchema = z.object({
    teamname: z.string().optional(),

    username2: z.string().nullable().optional(),
    username3: z.string().nullable().optional(),
    username4: z.string().nullable().optional(),
});


export const FeedbackSchema = z.object({
    firstName: z
        .string("First name is required"),

    lastName: z
        .string("Last name is required"),

    email: z
        .string("Email is required")
        .email("Please enter a valid email address"),

    message: z
        .string("Feedback message is required"),
});
