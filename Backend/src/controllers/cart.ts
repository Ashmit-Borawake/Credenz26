import { prisma } from '../config/db.js'
import type { Request, Response } from "express";
import { CartSchema, UpdateCartSchema } from '../types/event.types.js';

export const checkCart = async (eventSlug: string, username1: string) => {
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            eventSlug: eventSlug,
            username1: username1
        }
    })

    return cartItem ? true : false
}
export const checkUserAndCategory = async (res: Response, username: string, isJunior: boolean) => {

    const teammate = await prisma.user.findFirst({
        where: {
            username: username
        }
    })

    if (!teammate) {
        res.status(400).json({ "isAccepted": false, "message": `${username} not found` })
        return true
    }

    if (teammate.isJunior != isJunior) {
        res.status(401).json({ "isAccepted": false, "message": "All User Should should be from same category (Junior/Senior)" })
        return true
    }

    return false

}
export const checkOrder = async (res: Response, eventSlug: string, username: string) => {
    const order = await prisma.order.findFirst({
        where: {
            eventSlug: eventSlug,
            OR: [
                { username1: username },
                { username2: username },
                { username3: username },
                { username4: username }
            ]
        }
    })

    if (order) {
        res.status(401).json({ "isAccepted": false, "message": `${username} has already ordered this event` })
        return true
    }

    return false
}

export const checkEvent = async (eventSlug: string) => {
    const event = await prisma.event.findFirst({
        where: {
            slug: eventSlug
        }
    })
    return event ? true : false
}

export const getCartItems = async (req: Request, res: Response) => {

    try {
        const username1 = req.user.username

        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" })
        }

        const cartItems = await prisma.cartItem.findMany({
            where: {
                username1: username1
            },
            include:{
                event:{
                    select:{
                        price:true,
                        title:true  
                    }
                       
                }
            }
        })

        return res.status(200).json({ "cartItems": cartItems })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const addToCart = async (req: Request, res: Response) => {
    try {
        console.log("Cart : ",req.user.username)
        const username1 = req.user.username
        const isJunior = req.user.isJunior

        if (!username1) {
            return res.status(400).json({ "error": "Username not found in Cookie" })
        }

        const parsed = CartSchema.safeParse(req.body.event)

        if (parsed.error) {
            return res.status(400).json({ "error": parsed.error })
        }

        let cartItem = parsed.data

        const usernames = [
            username1,
            cartItem.username2,
            cartItem.username3,
            cartItem.username4,
        ].filter(Boolean)

        // Check for duplicates
        const uniqueUsernames = new Set(usernames)

        if (uniqueUsernames.size !== usernames.length) {
            return res.status(401).json({isAllowed:false,
                message: "Same username cannot be used more than once in a team",
            })
        }

        if (!await checkEvent(cartItem.eventSlug)) {
            return res.status(400).json({ "error": "Event not found" })
        }

        //If no teamname..solo participation make teamname same as username
        if (!cartItem.teamname) {
            cartItem.teamname = username1 + "(SOLO)"
        }

        if (await checkCart(cartItem.eventSlug, username1)) {
            return res.status(401).json({ "isAllowed": false, "message": "Event Already in Cart" })
        }


        if (await checkOrder(res, cartItem.eventSlug, username1)) {
            return
        }
        if (cartItem.username2 && (await checkUserAndCategory(res, cartItem.username2, isJunior) || await checkOrder(res, cartItem.eventSlug, cartItem.username2))) {
            return
        }
        if (cartItem.username3 && (await checkUserAndCategory(res, cartItem.username3, isJunior) || await checkOrder(res, cartItem.eventSlug, cartItem.username3))) {
            return
        }
        if (cartItem.username4 && (await checkUserAndCategory(res, cartItem.username4, isJunior) || await checkOrder(res, cartItem.eventSlug, cartItem.username4))) {
            return
        }

        let cartItemDetails = JSON.parse(JSON.stringify(parsed.data))

        cartItemDetails["username1"] = username1

        cartItemDetails = await prisma.cartItem.create({
            data: cartItemDetails,
        })

        return res.status(200).json({ "isAllowed": true, "message": "Event Added to the Cart" })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }

}

export const deleteCartItem = async (req: Request, res: Response) => {

    try {
        const username1 = req.user.username

        const cartID = req.params.cartID as string

        if (!cartID) {
            return res.status(400).json({ "error": "Cart ID not found" })
        }

        //check id userid is same in token or not
        const cartItem = await prisma.cartItem.delete({
            where: {
                id: cartID,
                username1: username1
            },
        })

        return res.status(200).json({ "cartItems": cartItem })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }
}

export const updateCartItem = async (req: Request, res: Response) => {

    try {

        const username1 = req.user.username
        const isJunior = req.user.isJunior
        const cartID = req.params.cartID as string

        if (!cartID) {
            return res.status(400).json({ "error": "Cart ID not found" })
        }

        const parsed = UpdateCartSchema.safeParse(req.body.event)

        if (!parsed.success) {
            return res.status(400).json({ "error": parsed.error })
        }

        let cartItem = parsed.data

        const usernames = [
            username1,
            cartItem.username2,
            cartItem.username3,
            cartItem.username4,
        ].filter(Boolean)

        // Check for duplicates
        const uniqueUsernames = new Set(usernames)

        if (uniqueUsernames.size !== usernames.length) {
            return res.status(401).json({
                "isAllowed":false,
                "message": "Same username cannot be used more than once in a team",
            })
        }

        if (cartItem.username2 && await checkUserAndCategory(res, cartItem.username2, isJunior)) {
            return
        }
        if (cartItem.username3 && await checkUserAndCategory(res, cartItem.username3, isJunior)) {
            return
        }
        if (cartItem.username4 && await checkUserAndCategory(res, cartItem.username4, isJunior)) {
            return
        }

        let updateDetails = JSON.parse(JSON.stringify(parsed.data))

        const _ = await prisma.cartItem.update({
            where: {
                id: cartID,
                username1: username1,
            },
            data: updateDetails
        })

        return res.status(200).json({ "message": "Event Details Updated Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": error })
    }

}
