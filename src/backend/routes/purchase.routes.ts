import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { makePurchase } from '../controllers/purchase.controller'

const router = express.Router()

router.post("/", authMiddleware, makePurchase)

export default router