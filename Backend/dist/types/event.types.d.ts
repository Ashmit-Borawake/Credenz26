import * as z from "zod";
export declare const EventSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    type: z.ZodEnum<{
        TECH: "TECH";
        NON_TECH: "NON_TECH";
        PASS: "PASS";
    }>;
    price: z.ZodNumber;
    maxTeamSize: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        TECH: "TECH";
        NON_TECH: "NON_TECH";
        PASS: "PASS";
    }>>;
    price: z.ZodOptional<z.ZodNumber>;
    maxTeamSize: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CartSchema: z.ZodObject<{
    eventID: z.ZodUUID;
    teamname: z.ZodOptional<z.ZodString>;
    username2: z.ZodOptional<z.ZodString>;
    username3: z.ZodOptional<z.ZodString>;
    username4: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateCartSchema: z.ZodObject<{
    teamname: z.ZodOptional<z.ZodString>;
    username2: z.ZodOptional<z.ZodString>;
    username3: z.ZodOptional<z.ZodString>;
    username4: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UserSignupSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    collegeName: z.ZodString;
    profilePic: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isJunior: z.ZodBoolean;
}, z.core.$strip>;
export declare const UserLoginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=event.types.d.ts.map