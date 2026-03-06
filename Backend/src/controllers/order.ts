import { prisma } from '../config/db.js'
import { PassStatus } from '../../generated/prisma/enums.js';
import type { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { sendOrderEmail, type OrderedEvent } from '../utils/email.js';

const getUsersPassStatus = async (usernames: string[]) => {
    const usersPassStatus = await prisma.user.findMany({
        where: {
            username: {
                in: usernames,
            }
        },
        select: {
            username: true,
            passStatus: true
        }
    })

    return usersPassStatus
}

export const getPrice = async (req: Request, res: Response) => {

    try {
        const username1 = req.user.username

        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" })
        }

        const cartItems = await prisma.cartItem.findMany({
            where: {
                username1: username1
            },
            include: {
                event: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        })

        if (cartItems.length === 0) {
            return res.status(200).json({ "isAccepted": true, "subTotal": 0, "totalPayable": 0, "discount": 0 })

        }

        const userSet = new Set<string>();

        for (const item of cartItems) {
            if (item.username1) userSet.add(item.username1);
            if (item.username2) userSet.add(item.username2);
            if (item.username3) userSet.add(item.username3);
            if (item.username4) userSet.add(item.username4);
        }

        const usersPassStatus = await getUsersPassStatus([...userSet]);

        let userMap = new Map<string, string>();
        for (const user of usersPassStatus) {
            userMap.set(user.username, user.passStatus)
        }
        let subTotal = 0
        let totalPayable = 0
        for (let item of cartItems) {


            const teanameExist = await prisma.order.findFirst({
                where:{
                    teamname:item.teamname,
                    eventSlug:item.eventSlug
                }
            })

            if(teanameExist){
                if(item.eventSlug=="oss"){
                    return res.status(401).json({ "isAccepted": false, "message": `Username : ${item.teamname} already exists for ${item.event.title}` })
                }
                else{
                    return res.status(401).json({ "isAccepted": false, "message": `TeamName : ${item.teamname} already exists for ${item.event.title}` })
                }
            }

            subTotal += item.event.price
            if (item.event.price == 0) {
                continue;
            }
            if (item.event.title === "ROBOLIGA") {
                totalPayable += item.event.price

                continue;
            }

            let pending = 0;
            let approved = 0;
            let none = 0;

            if (userMap.get(item.username1) == PassStatus.APPROVED) {
                approved += 1
            }
            else if (userMap.get(item.username1) == PassStatus.PENDING) {
                pending += 1
            }
            else {
                none++
            }

            if (item.username2) {
                if (userMap.get(item.username2) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (userMap.get(item.username2) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }
            if (item.username3) {
                if (userMap.get(item.username3) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (userMap.get(item.username3) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }
            if (item.username4) {
                if (userMap.get(item.username4) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (userMap.get(item.username4) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }

            if (approved > 0) {
                continue
            }
            else if (pending > 0) {
                    return res.status(401).json({ "isAccepted": false, "message": `Your pass for "${item.event.title}" is currently under review. Checkout will be available once it is approved.` })
                } else {
                totalPayable += item.event.price
            }

        }
        return res.status(200).json({ "isAccepted": true, "subTotal": subTotal, "totalPayable": totalPayable, "discount": subTotal - totalPayable })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const confirmOrder = async (req: Request, res: Response) => {

    try {

        const username1 = req.user.username

        const transactionID = req.body.transactionID

        if (!transactionID) {
            return res.status(400).json({ "error": "TransactionID not found" })
        }

        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" })
        }

        const cartItems = await prisma.cartItem.findMany({
            where: {
                username1: username1
            },
            include: {
                event: true
            }
        })

        if (cartItems.length === 0) {
            return res.status(400).json({ "error": "No items in cart" });
        }

        //calculate price 
        let userMap = new Map<string, string[]>();
        for (const item of cartItems) {
            if (item.username1) {
                if (!userMap.get(item.username1)) {
                    userMap.set(item.username1, [])
                }
                userMap.get(item.username1)?.push(item.eventSlug)
            }
            if (item.username2) {
                if (!userMap.get(item.username2)) {
                    userMap.set(item.username2, [])
                }
                userMap.get(item.username2)?.push(item.eventSlug)
            }
            if (item.username3) {
                if (!userMap.get(item.username3)) {
                    userMap.set(item.username3, [])
                }
                userMap.get(item.username3)?.push(item.eventSlug)
            }
            if (item.username4) {
                if (!userMap.get(item.username4)) {
                    userMap.set(item.username4, [])
                }
                userMap.get(item.username4)?.push(item.eventSlug)
            }

        }

        const usersPassStatus = await getUsersPassStatus([...userMap.keys()])

        let passMap = new Map<string, string>();
        for (const user of usersPassStatus) {
            passMap.set(user.username, user.passStatus)
        }

        let ordered_events:OrderedEvent[]=[];

        const orderID = uuidv4()
        const orders = []
        for (const item of cartItems) {
            let order = {
                orderID: orderID,
                eventSlug: item.event.slug,
                actualPrice: item.event.price,
                pricePaid: item.event.price,
                teamname: item.teamname ?? "",
                username1: username1,
                username2: item.username2 ?? null,
                username3: item.username3 ?? null,
                username4: item.username4 ?? null,
                transactionID: transactionID,
                isVerified: true,
            }

            if (item.event.price == 0) {
                ordered_events.push({
                    name:item.event.title,
                    username1: username1,
                    username2:item.username2!,
                    username3:item.username3!,
                    username4:item.username4!
                })
                orders.push(order);
                continue;
            }

            if (item.event.title == "ROBOLIGA") {
                order.isVerified = false
                orders.push(order);
                continue;
            }

            let pending = 0;
            let approved = 0;
            let none = 0;

            if (passMap.get(item.username1) == PassStatus.APPROVED) {
                approved += 1
            }
            else if (passMap.get(item.username1) == PassStatus.PENDING) {
                pending += 1
            }
            else {
                none++
            }

            if (item.username2) {
                if (passMap.get(item.username2) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (passMap.get(item.username2) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }
            if (item.username3) {
                if (passMap.get(item.username3) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (passMap.get(item.username3) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }
            if (item.username4) {
                if (passMap.get(item.username4) == PassStatus.APPROVED) {
                    approved += 1
                }
                else if (passMap.get(item.username4) == PassStatus.PENDING) {
                    pending += 1
                }
                else {
                    none++
                }
            }

            if (approved > 0) {
                order.pricePaid = 0
                orders.push(order);
                ordered_events.push({
                    name:item.event.title,
                    username1: username1,
                    username2:item.username2!,
                    username3:item.username3!,
                    username4:item.username4!
                })
            }
            else if (pending > 0) {
                return res.status(401).json({ "isAccepted": false, "message": `WARNING ${item.event.title} WOULD BE CHARGED ${item.event.price} AS PASS IS PENDING!!!` })
            } else {
                order.isVerified = false
                orders.push(order);
            }
        }
        await prisma.order.createMany({
            data: orders
        })

        for (const [username, eventSlugs] of userMap.entries()) {
            await prisma.cartItem.deleteMany({
                where: {
                    username1: username,
                    eventSlug: { in: eventSlugs }
                }
            });
        }

        console.log("ordered_events",ordered_events.length);
        if(ordered_events.length>0){
            await sendOrderEmail(
                req.user.email,
                username1,
                ordered_events
            );
        }

        return res.status(201).json({ "message": "Order Created Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }

}

export const viewOrders = async (req: Request, res: Response) => {

    try {

        const username1 = req.user.username
        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" })
        }

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { username1: username1 },
                    { username2: username1 },
                    { username3: username1 },
                    { username4: username1 },
                ],
            },
        });

        return res.status(200).json({ "orders": orders })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

