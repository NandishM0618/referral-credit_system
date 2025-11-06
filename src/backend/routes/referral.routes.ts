import express from 'express'
import { getDashboardStats, getReferralLink } from '../controllers/referral.controllers';
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router();

router.get("/link", authMiddleware, getReferralLink);
router.get("/dashboard", authMiddleware, getDashboardStats)

export default router