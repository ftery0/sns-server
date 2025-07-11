import { Router } from 'express';
import { getBestPosts } from '../controllers/bestController';

const router = Router();

// 베스트 게시물 조회
router.get('/posts', getBestPosts);

export default router; 