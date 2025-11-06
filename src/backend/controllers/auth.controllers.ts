import { Request, Response } from "express";
import User, { IUser } from '../models/user.model'
import mongoose from "mongoose";

const generateReferralCode = (name: string): string => {
    return `${name.substring(0, 4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, referralCodeUsed } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const newReferralCode = generateReferralCode(name);

        let referredById: mongoose.Types.ObjectId | null = null;

        if (referralCodeUsed) {
            const referrer = await User.findOne({ referralCode: referralCodeUsed }) as IUser | null
            if (referrer?._id) referredById = referrer._id as mongoose.Types.ObjectId
        }

        const newUser = await User.create({
            name, email, password, referralCode: newReferralCode, referredBy: referredById,
        });

        res.status(201).json({
            message: "User created Successfully", user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                referralCode: newUser.referralCode,
                referredBy: newUser.referredBy,
            },
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = user.generateAuthToken()
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Logout failed" });
    }
}