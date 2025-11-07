import express from 'express'
import { getDashboardStats, getReferralLink, getReferredUsers } from '../controllers/referral.controllers';
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router();

router.get("/link", authMiddleware, getReferralLink);
router.get("/dashboard", authMiddleware, getDashboardStats)
router.get("/users", authMiddleware, getReferredUsers)

export default router