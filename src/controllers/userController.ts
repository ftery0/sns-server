import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getMyProfileService, updateMyProfileService, getUserProfileService } from '../services/userService';

// 내 프로필 조회
export const getMyProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const userId = req.user._id as mongoose.Types.ObjectId;
    const user = await getMyProfileService(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '프로필 조회 실패', error: err });
  }
};

// 내 프로필 수정
export const updateMyProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const userId = req.user._id as mongoose.Types.ObjectId;
    const { nickname, bio, profileImage } = req.body as { nickname?: string; bio?: string; profileImage?: string };
    const user = await updateMyProfileService(userId, nickname, bio, profileImage);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '프로필 수정 실패', error: err });
  }
};

// 특정 유저 프로필 조회 (id로)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const user = await getUserProfileService(userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '유저 조회 실패', error: err });
  }
}; 