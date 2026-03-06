import { prisma } from '../config/db.js'
import { PassStatus } from '../../generated/prisma/enums.js';
import { EventType } from '../../generated/prisma/enums.js';
import type { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

export const checkPass = async (req: Request, res: Response) => {
  try {
    const username = req.user.username

    if (!username) {
      return res.status(400).json({ "error": "Username not found in Cookie" })
    }

    const user = await prisma.user.findFirst({
      where: {
        username: username
      },
      select: {
        passStatus: true
      }
    })
    if (!user) {
      return res.status(400).json({ "error": "User not found" })
    }
    const hasPass = user.passStatus === PassStatus.PENDING || user.passStatus === PassStatus.APPROVED

    return res.status(200).json({
      "hasPass": hasPass,
      "passStatus": user.passStatus
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ "error": error })
  }
}

export const buyPass = async (req: Request, res: Response) => {
  try {
    const username = req.user.username
    const {transactionID } = req.body;

    if (!username || !transactionID) {
      return res.status(400).json({
        error: "username and transactionID are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.passStatus !== PassStatus.NONE) {
      return res.status(400).json({
        error: "User already has or requested a pass"
      });
    }


    // const passEvent = await prisma.event.findFirst({
    //   where: { type: EventType.PASS }
    // });

    // if (!passEvent) {
    //   return res.status(500).json({
    //     error: "PASS event not found in database"
    //   });
    // }
 // 3️⃣ Create order (eventID = slug)
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderID: uuidv4(),
        eventSlug: "credenz_pass",
        username1: username,
        transactionID,
        isVerified: false,
        actualPrice: 200,
        pricePaid: 200
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { passStatus: PassStatus.PENDING }
    });

    return res.status(200).json({
      message: "Pass purchased successfully",
      passStatus: PassStatus.PENDING,
      order
    });

  } catch (error) {
    console.error("buyPass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};