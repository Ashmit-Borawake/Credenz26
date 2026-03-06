import { prisma } from '../config/db.js';
import { PassStatus } from '../../generated/prisma/enums.js';
import { v4 as uuidv4 } from 'uuid';
export const checkPass = async (req, res) => {
    try {
        const username = req.cookies.token.username;
        if (!username) {
            return res.status(400).json({ "error": "Username not found in Cookie" });
        }
        const user = await prisma.user.findFirst({
            where: {
                username: username
            },
            select: {
                passStatus: true
            }
        });
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }
        const hasPass = user.passStatus === PassStatus.PENDING || user.passStatus === PassStatus.APPROVED;
        return res.status(200).json({
            "hasPass": hasPass,
            "passStatus": user.passStatus
        });
    }
    catch (error) {
        return res.status(500).json({ "error": error });
    }
};
export const buyPass = async (req, res) => {
    const username = req.cookies.token.username;
    if (!username) {
        return res.status(400).json({ "error": "Username not found in Cookie" });
    }
    const transactionID = req.body.transactionID;
    if (!transactionID) {
        return res.status(400).json({ "error": "TransactionID not found" });
    }
    const pass = await prisma.order.create({
        data: {
            orderID: uuidv4(),
            username1: username,
            eventID: "pass",
            transactionID: transactionID,
            isVerified: false,
        }
    });
    return res.status(200).json({ "message": "Pass bought successfully", "pass": pass });
};
//# sourceMappingURL=pass.js.map