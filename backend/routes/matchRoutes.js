import express from 'express'
import { getUserMatches } from '../controllers/matchController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
const router = express.Router();

router.get('/:userId', verifyToken, getUserMatches);

export default router;
