import { Request, Response } from "express";
import User from "../models/user.model";
import Purchase from "../models/purchase.model";
import Referral from "../models/referral.model";

export const makePurchase = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const existingPurchases = await Purchase.find({ user: userId });
        const isFirstPurchase = existingPurchases.length === 0;

        const purchase = await Purchase.create({
            user: userId,
            amount: req.body.amount || 0,
            isFirstPurchase,
            isCredited: false,
        });

        let updatedUserCredits = 0;
        let referrerCredits: number | null = null;

        if (isFirstPurchase) {
            const referral = await Referral.findOne({ referredUser: userId });
            if (referral && referral.status === "pending") {
                const referredUser = await User.findById(userId);
                const referrer = await User.findById(referral.referrer);

                if (referrer && referredUser) {
                    referredUser.credits = (referredUser.credits || 0) + 2;
                    referrer.credits = (referrer.credits || 0) + 2;
                    referral.status = "converted";
                    purchase.isCredited = true;

                    await referredUser.save();
                    await referrer.save();
                    await referral.save();
                    await purchase.save();

                    updatedUserCredits = referredUser.credits;
                    referrerCredits = referrer.credits;
                }
            }
        } else {
            const user = await User.findById(userId);
            updatedUserCredits = user?.credits || 0;
        }

        res.status(201).json({
            message: "Purchase successful",
            purchase,
            userCredits: updatedUserCredits,
            referrerCredits,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Purchase failed" });
    }
};
