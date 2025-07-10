import { Router } from 'express';
import { getRecommendedUsers } from '../controllers/recommendController';

const router = Router();

// 추천 유저 리스트
router.get('/users', getRecommendedUsers);

export default router; 