import { Request, Response } from "express";
import User from "../models/user.model";
import Referral from "../models/referral.model";

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export const getReferralLink = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const referralLink = `${FRONTEND_URL}/register?r=${user.referralCode}`;
        res.status(200).json({ referralLink });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch referral link" })
    }
}

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        const totalReferrals = await Referral.countDocuments({ referrer: userId })
        const convertedUsers = await Referral.countDocuments({
            referrer: userId,
            status: "converted",
        })

        const user = await User.findById(userId);
        const totalCredits = user?.credits || 0;

        res.status(200).json({
            referredUsers: totalReferrals,
            convertedUsers,
            totalCredits,
            referralCode: user?.referralCode,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' })
    }
}

export const getReferredUsers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const referredUsers = await Referral.find({ referrer: userId })
            .sort({ createdAt: -1 })
            .populate("referredUser", "name email");

        const formattedUsers = referredUsers.map((u: any) => ({
            id: u._id,
            name: u.referredUser?.name ?? "Unknown",
            email: u.referredUser?.email ?? "N/A",
            joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "",
            status: u.status ?? "Pending",
        }));

        res.json({ users: formattedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch referred users" });
    }
};