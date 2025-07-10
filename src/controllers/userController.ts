import { Request, Response } from 'express';
import User from '../models/User';

// 내 프로필 조회
export const getMyProfile = (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  res.json(req.user);
};

// 내 프로필 수정
export const updateMyProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const { nickname, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      (req.user as any)._id,
      { nickname, bio, profileImage },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '프로필 수정 실패', error: err });
  }
};

// 특정 유저 프로필 조회 (id로)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-providerId -provider');
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '유저 조회 실패', error: err });
  }
}; 