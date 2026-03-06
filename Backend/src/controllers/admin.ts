import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import { UserLoginSchema } from "../types/event.types.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PassStatus, userType } from "../../generated/prisma/enums.js";
import { sendGenericEmail,sendOrderEmailAdmin, sendPassApprovalEmail, type OrderedEvent } from "../utils/email.js";


export const adminLogin = async (req: Request, res: Response) => {
    try {
        console.log(req.body.user)
        const parsed = UserLoginSchema.safeParse(req.body.user)
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0]?.message })
        }
        const user = parsed.data;
        const existing = await prisma.user.findFirst({
            where: {
                username: user.username,
                userType: {
                    in: [userType.ADMIN, userType.SUBADMIN]
                }
            }
        })
        if (!existing) {
            console.log("User not found:", user.username)
            return res.status(400).json({ error: "User not found" })
        }
        const isMatch = await bcrypt.compare(user.password, existing.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" })
        }
        const token = jwt.sign({ username: existing.username, isJunior: existing.isJunior, email: existing.email, userType: existing.userType }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            
            httpOnly: true,
            secure: isProd,                      
            sameSite: isProd ? "none" : "lax",   
            maxAge: 24*60 * 60 * 1000,
        });



        return res.status(200).json({ token: token, userType: existing.userType })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}
//admin routes
export const viewAllOrders = async (req: Request, res: Response) => {

    try {

        const rows = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                isVerified: false,
                NOT: {
                    eventSlug: "credenz_pass"
                }
            }
        })

        let orderMap = new Map<string, {
            "originalOrderValue": number,
            "finalOrderValue": number,
            "isApproved": boolean
            , "orderItems": {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderID: string;
                eventSlug: string;
                teamname: string;
                originalPrice: number,
                finalPrice: number,
                username1: string;
                username2: string | null;
                username3: string | null;
                username4: string | null;
                transactionID: string;
                isVerified: boolean;
            }[]
        }>();
        rows.forEach((row) => {
            if (!orderMap.has(row.orderID)) {
                orderMap.set(row.orderID, {
                    originalOrderValue: 0,
                    finalOrderValue: 0,
                    isApproved: true,
                    orderItems: []
                });
            }
            let order = orderMap.get(row.orderID);

            if (order) {
                order.finalOrderValue += row.pricePaid;
                order.originalOrderValue += row.actualPrice;
                order.isApproved = order.isApproved && !row.isVerified ? false : true
            }

            orderMap.get(row.orderID)!.orderItems.push({
                id: row.id,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                orderID: row.orderID,
                eventSlug: row.eventSlug,
                teamname: row.teamname,
                originalPrice: row.actualPrice,
                finalPrice: row.pricePaid,
                username1: row.username1,
                username2: row.username2,
                username3: row.username3,
                username4: row.username4,
                transactionID: row.transactionID,
                isVerified: row.isVerified
            })
        })

        return res.status(200).json({
            orders: Array.from(orderMap.entries()),
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const approveOrder = async (req: Request, res: Response) => {

    try {
        const orderID = req.params.orderID as string
        if (!orderID) {
            return res.status(400).json({ "error": "OrderID not found" })
        }

        const orders = await prisma.order.updateManyAndReturn({
            where: {
                orderID: orderID,
            },
            data: {
                isVerified: true
            }
        })


        let ordered_events: OrderedEvent[] = []

        for (const order of orders) {

            let eventName = order.eventSlug.toUpperCase().replaceAll("_", " ")

            ordered_events.push({
                name: eventName,
                username1: order.username1,
                username2: order.username2!,
                username3: order.username3!,
                username4: order.username4!,

            })
        }

        const user = await prisma.user.findFirst({
            where: {
                username: orders[0]!.username1
            }
        })

        if (user) {
            await sendOrderEmailAdmin(user.email, user.username, ordered_events)
        }

        res.status(200).json({ "message": "Orders Approved" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const declineOrder = async (req: Request, res: Response) => {
    try {
        const orderID = req.params.orderID as string
        if (!orderID) {
            return res.status(400).json({ "error": "OrderID not found" })
        }

        await prisma.order.deleteMany({
            where: {
                orderID: orderID,
            },
        })

        res.status(200).json({ "message": "Orders Declined " })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const viewAllPassOrders = async (req: Request, res: Response) => {

    try {

        const rows = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                isVerified: false,
                eventSlug: "credenz_pass",

            }
        })

        return res.status(200).json({
            orders: rows,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const approvePassOrder = async (req: Request, res: Response) => {

    try {
        const orderID = req.params.orderID as string
        if (!orderID) {
            return res.status(400).json({ "error": "OrderID not found" })
        }

        let userOrder = await prisma.order.updateManyAndReturn({
            where: {
                orderID: orderID,
                eventSlug: "credenz_pass"
            },
            data: {
                isVerified: true
            }
        })

        if (userOrder.length > 0) {
            const user = await prisma.user.update({
                where: {
                    username: userOrder[0]!.username1
                },
                data: {
                    passStatus: PassStatus.APPROVED
                }
            })
            await sendPassApprovalEmail(user.email, user.username)
        }

        res.status(200).json({ "message": "Orders Approved" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const declinePassOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!id) {
            return res.status(400).json({ "error": "OrderID not found" })
        }

        const order = await prisma.order.delete({
            where: {
                id: id
            }
        })

        await prisma.user.update({
            where: {
                username: order.username1
            },
            data: {
                passStatus: PassStatus.NONE
            }
        })


        res.status(200).json({ "message": "Pass Declined " })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const adminBuyPass = async (req: Request, res: Response) => {

    try {

        const { username, transactionID } = req.body;

        if (!username || !transactionID) {
            return res.status(400).json({
                error: "username and transactionID are required"
            });
        }

        const order = await prisma.order.create({
            data: {
                id: uuidv4(),
                orderID: uuidv4(),
                eventSlug: "credenz_pass",
                username1: username,
                transactionID,
                isVerified: true,
                actualPrice: 200,
                pricePaid: 200
            }
        });


        const user = await prisma.user.update({
            where: { username: username },
            data: { passStatus: PassStatus.APPROVED }
        });

        if (user) {
            await sendPassApprovalEmail(user.email, user.username)
        }
        return res.status(200).json({
            message: "Pass purchased successfully",
            passStatus: PassStatus.APPROVED,
            order
        });

    } catch (error) {
        console.error("buyPass error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const adminOrder = async (req: Request, res: Response) => {

    try {
        const { username1, username2, username3, username4, eventSlug, teamname, transactionID } = req.body;

        if (!username1 || !eventSlug || !transactionID) {
            return res.status(400).json({ "error": "Missing required fields" })
        }

        let eventName = eventSlug.toUpperCase().replaceAll("_", " ")

        if (teamname) {
            const teanameExist = await prisma.order.findFirst({
                where: {
                    teamname: teamname,
                    eventSlug: eventSlug
                }
            })

            if (teanameExist) {
                return res.status(401).json({ "isAccepted": false, "message": `TeamName : ${teamname} already exists for ${eventName}` })

            }
        }

        const order = await prisma.order.create({
            data: {
                id: uuidv4(),
                orderID: uuidv4(),
                eventSlug,
                username1,
                username2,
                username3,
                username4,
                teamname,
                transactionID,
                isVerified: true,
            }
        });

        const user = await prisma.user.findFirst({
            where: {
                username: username1
            }
        })

        if (user) {
            await sendOrderEmailAdmin(user.email, user.username, [{
                name: eventName,
                username1: username1,
                username2: username2,
                username3: username3,
                username4: username4,
            }])
        }

        return res.status(200).json({
            message: "Order created successfully",
            order
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const sendEmail = async (req: Request, res: Response) => {

    try {
        const { subject, content, username } = req.body;
        if (!subject || !content || !username) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await sendGenericEmail(user.email, subject, content, username);
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export const viewAllApprovedOrders = async (req: Request, res: Response) => {

    try {

        const rows = await prisma.order.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: {
                isVerified: true,
            }
        })

        let orderMap = new Map<string, {
            "originalOrderValue": number,
            "finalOrderValue": number,
            "isApproved": boolean
            , "orderItems": {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderID: string;
                eventSlug: string;
                teamname: string;
                originalPrice: number,
                finalPrice: number,
                username1: string;
                username2: string | null;
                username3: string | null;
                username4: string | null;
                transactionID: string;
                isVerified: boolean;
            }[]
        }>();
        rows.forEach((row) => {
            if (!orderMap.has(row.orderID)) {
                orderMap.set(row.orderID, {
                    originalOrderValue: 0,
                    finalOrderValue: 0,
                    isApproved: true,
                    orderItems: []
                });
            }
            let order = orderMap.get(row.orderID);

            if (order) {
                order.finalOrderValue += row.pricePaid;
                order.originalOrderValue += row.actualPrice;
                order.isApproved = order.isApproved && !row.isVerified ? false : true
            }

            orderMap.get(row.orderID)!.orderItems.push({
                id: row.id,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                orderID: row.orderID,
                eventSlug: row.eventSlug,
                teamname: row.teamname,
                originalPrice: row.actualPrice,
                finalPrice: row.pricePaid,
                username1: row.username1,
                username2: row.username2,
                username3: row.username3,
                username4: row.username4,
                transactionID: row.transactionID,
                isVerified: row.isVerified
            })
        })

        return res.status(200).json({
            orders: Array.from(orderMap.entries()),
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const username = req.body.user.username;

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        return res.status(200).json({ user: user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}
