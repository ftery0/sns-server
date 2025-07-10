import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

export const getMyProfileService = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
  return User.findById(userId);
};

export const updateMyProfileService = async (
  userId: mongoose.Types.ObjectId,
  nickname?: string,
  bio?: string,
  profileImage?: string
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    { nickname, bio, profileImage },
    { new: true }
  );
};

export const getUserProfileService = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
  return User.findById(userId).select('-providerId -provider');
}; 