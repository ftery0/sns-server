import { Request, Response } from 'express';
import { getRecommendedUsersService } from '../services/recommendService';

export const getRecommendedUsers = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const myId = (req.user as any)._id;
    const users = await getRecommendedUsersService(myId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: '추천 유저 조회 실패', error: err });
  }
}; 