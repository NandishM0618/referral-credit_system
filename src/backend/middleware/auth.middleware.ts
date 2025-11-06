import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "token missing from header" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("jwt secret is not defined in environment variables");
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ error: "Invalid token structure" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
