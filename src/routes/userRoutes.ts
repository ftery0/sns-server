import { Router } from 'express';
import { getMyProfile, updateMyProfile, getUserProfile } from '../controllers/userController';

const router = Router();

// 내 프로필 조회
router.get('/me', getMyProfile);
// 내 프로필 수정
router.put('/me', updateMyProfile);
// 특정 유저 프로필 조회
router.get('/:id', getUserProfile);

export default router; 