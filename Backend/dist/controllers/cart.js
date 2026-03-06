import { prisma } from '../config/db.js';
import { CartSchema, UpdateCartSchema } from '../types/event.types.js';
const checkCart = async (eventID, username1) => {
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            eventID: eventID,
            username1: username1
        }
    });
    return cartItem ? true : false;
};
const checkUserAndCategory = async (res, username, isJunior) => {
    const teammate = await prisma.user.findFirst({
        where: {
            username: username
        }
    });
    if (!teammate) {
        res.status(400).json({ "isAccepted": false, "message": "User not found" });
        return true;
    }
    if (teammate.isJunior != isJunior) {
        res.status(400).json({ "isAccepted": false, "message": "All User Should should be from same category (Junior/Senior)" });
        return true;
    }
    return false;
};
const checkOrder = async (res, eventID, username) => {
    const order = await prisma.order.findFirst({
        where: {
            eventID: eventID,
            OR: [
                { username1: username },
                { username2: username },
                { username3: username },
                { username4: username }
            ]
        }
    });
    if (order) {
        res.status(400).json({ "isAccepted": false, "message": `${username} has already ordered this event` });
        return true;
    }
    return false;
};
const checkEvent = async (eventID) => {
    const event = await prisma.event.findFirst({
        where: {
            id: eventID
        }
    });
    return event ? true : false;
};
export const getCartItems = async (req, res) => {
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
                    }
                }
            }
        });
        return res.status(200).json({ "cartItems": cartItems });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
export const addToCart = async (req, res) => {
    try {
        const username1 = req.cookies.token.username;
        const isJunior = req.cookies.token.isJunior;
        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" });
        }
        const parsed = CartSchema.safeParse(req.body.event);
        if (parsed.error) {
            return res.status(400).json({ "error": parsed.error });
        }
        let cartItem = parsed.data;
        const usernames = [
            username1,
            cartItem.username2,
            cartItem.username3,
            cartItem.username4,
        ].filter(Boolean);
        // Check for duplicates
        const uniqueUsernames = new Set(usernames);
        if (uniqueUsernames.size !== usernames.length) {
            return res.status(400).json({
                error: "Same username cannot be used more than once in a team",
            });
        }
        if (!await checkEvent(cartItem.eventID)) {
            return res.status(400).json({ "error": "Event not found" });
        }
        //If no teamname..solo participation make teamname same as username
        if (!cartItem.teamname) {
            cartItem.teamname = username1;
        }
        if (await checkCart(cartItem.eventID, username1)) {
            return res.status(400).json({ "isAllowed": false, "message": "Event Already in Cart" });
        }
        //do we need to check teammates junior senior category??
        if (await checkOrder(res, cartItem.eventID, username1)) {
            return;
        }
        if (cartItem.username2 && (await checkUserAndCategory(res, cartItem.username2, isJunior) || await checkOrder(res, cartItem.eventID, cartItem.username2))) {
            return;
        }
        if (cartItem.username3 && (await checkUserAndCategory(res, cartItem.username3, isJunior) || await checkOrder(res, cartItem.eventID, cartItem.username3))) {
            return;
        }
        if (cartItem.username4 && (await checkUserAndCategory(res, cartItem.username4, isJunior) || await checkOrder(res, cartItem.eventID, cartItem.username4))) {
            return;
        }
        let cartItemDetials = JSON.parse(JSON.stringify(parsed.data));
        cartItemDetials["username1"] = username1;
        cartItemDetials = await prisma.cartItem.create({
            data: cartItemDetials,
        });
        return res.status(201).json({ "isAllowed": true, "message": "Event Added to the Cart" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
export const deleteCartItem = async (req, res) => {
    try {
        const username1 = req.cookies.token.username;
        const cartID = req.params.cartID;
        if (!cartID) {
            return res.status(400).json({ "error": "Cart ID not found" });
        }
        //check id userid is same in token or not
        const cartItem = await prisma.cartItem.delete({
            where: {
                id: cartID,
                username1: username1
            },
        });
        return res.status(200).json({ "cartItems": cartItem });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const username1 = req.cookies.token.username;
        const isJunior = req.cookies.token.isJunior;
        const cartID = req.params.cartID;
        if (!cartID) {
            return res.status(400).json({ "error": "Cart ID not found" });
        }
        const parsed = UpdateCartSchema.safeParse(req.body.event);
        if (!parsed.success) {
            return res.status(400).json({ "error": parsed.error });
        }
        let cartItem = parsed.data;
        const usernames = [
            username1,
            cartItem.username2,
            cartItem.username3,
            cartItem.username4,
        ].filter(Boolean);
        // Check for duplicates
        const uniqueUsernames = new Set(usernames);
        if (uniqueUsernames.size !== usernames.length) {
            return res.status(400).json({
                error: "Same username cannot be used more than once in a team",
            });
        }
        if (cartItem.username2 && await checkUserAndCategory(res, cartItem.username2, isJunior)) {
            return;
        }
        if (cartItem.username3 && await checkUserAndCategory(res, cartItem.username3, isJunior)) {
            return;
        }
        if (cartItem.username4 && await checkUserAndCategory(res, cartItem.username4, isJunior)) {
            return;
        }
        let updateDetails = JSON.parse(JSON.stringify(parsed.data));
        const _ = await prisma.cartItem.update({
            where: {
                id: cartID,
                username1: username1,
            },
            data: updateDetails
        });
        return res.status(200).json({ "message": "Event Details Updated Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": error });
    }
};
//# sourceMappingURL=cart.js.map