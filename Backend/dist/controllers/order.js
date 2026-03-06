import { prisma } from '../config/db.js';
import { PassStatus } from '../../generated/prisma/enums.js';
import { v4 as uuidv4 } from 'uuid';
const getPassStatus = async (username) => {
    const user = await prisma.user.findFirst({
        where: {
            username: username
        },
        select: {
            passStatus: true
        }
    });
    if (!user) {
        return PassStatus.NONE;
    }
    return user.passStatus;
};
export const getPrice = async (req, res) => {
    try {
        const username1 = req.cookies.token.username;
        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" });
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
        });
        if (cartItems.length === 0) {
            return res.status(400).json({ "error": "No items in cart" });
        }
        let userMap = new Map();
        for (const item of cartItems) {
            let passStatus = await getPassStatus(item.username1);
            userMap.set(item.username1, passStatus);
            if (item.username2 && !userMap.get(item.username2)) {
                passStatus = await getPassStatus(item.username2);
                userMap.set(item.username2, passStatus);
            }
            if (item.username3 && !userMap.get(item.username3)) {
                passStatus = await getPassStatus(item.username3);
                userMap.set(item.username3, passStatus);
            }
            if (item.username4 && !userMap.get(item.username4)) {
                passStatus = await getPassStatus(item.username4);
                userMap.set(item.username4, passStatus);
            }
        }
        let totalPayable = 0;
        for (const item of cartItems) {
            if (item.event.price == 0) {
                continue;
            }
            if (item.event.title == "ROBOLIGA") {
                totalPayable += item.event.price;
                continue;
            }
            let pending = 0;
            let approved = 0;
            let none = 0;
            if (userMap.get(item.username1) == PassStatus.APPROVED) {
                approved += 1;
            }
            else if (userMap.get(item.username1) == PassStatus.PENDING) {
                pending += 1;
            }
            else {
                none++;
            }
            if (item.username2) {
                if (userMap.get(item.username2) == PassStatus.APPROVED) {
                    approved += 1;
                }
                else if (userMap.get(item.username2) == PassStatus.PENDING) {
                    pending += 1;
                }
                else {
                    none++;
                }
            }
            if (item.username3) {
                if (userMap.get(item.username3) == PassStatus.APPROVED) {
                    approved += 1;
                }
                else if (userMap.get(item.username3) == PassStatus.PENDING) {
                    pending += 1;
                }
                else {
                    none++;
                }
            }
            if (item.username4) {
                if (userMap.get(item.username4) == PassStatus.APPROVED) {
                    approved += 1;
                }
                else if (userMap.get(item.username4) == PassStatus.PENDING) {
                    pending += 1;
                }
                else {
                    none++;
                }
            }
            if (approved > 0) {
                continue;
            }
            else if (pending > 0) {
                return res.status(400).json({ "isAccepted": false, "message": `WARNING ${item.event.title} WOULD BE CHARGED ${item.event.price} AS PASS IS PENDING!!!` });
            }
            else {
                totalPayable += item.event.price;
            }
        }
        return res.status(200).json({ "isAccepted": true, "totalPayable": totalPayable });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
export const confirmOrder = async (req, res) => {
    try {
        const username1 = req.cookies.token.username;
        const transactionID = req.body.transactionID;
        if (!transactionID) {
            return res.status(400).json({ "error": "TransactionID not found" });
        }
        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" });
        }
        const cartItems = await prisma.cartItem.findMany({
            where: {
                username1: username1
            }
        });
        if (cartItems.length === 0) {
            return res.status(400).json({ "error": "No items in cart" });
        }
        const orderID = uuidv4();
        await prisma.order.createMany({
            data: cartItems.map(item => ({
                orderID: orderID,
                username1: item.username1,
                username2: item?.username2,
                username3: item?.username3,
                username4: item?.username4,
                eventID: item.eventID,
                teamname: item?.teamname,
                transactionID: transactionID
            }))
        });
        let userMap = new Map();
        for (const item of cartItems) {
            const usernames = [
                item.username1, // required
                item.username2,
                item.username3,
                item.username4,
            ].filter(Boolean); // removes undefined / null
            for (const username of usernames) {
                if (!userMap.has(username)) {
                    userMap.set(username, []);
                }
                userMap.get(username).push(item.eventID);
            }
        }
        for (const [username, eventIDs] of userMap.entries()) {
            await prisma.cartItem.deleteMany({
                where: {
                    username1: username,
                    eventID: { in: eventIDs }
                }
            });
        }
        return res.status(201).json({ "message": "Order Created Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
//# sourceMappingURL=order.js.map