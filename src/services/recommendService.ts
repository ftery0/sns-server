import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

export const getRecommendedUsersService = async (myId: mongoose.Types.ObjectId): Promise<IUser[]> => {
  const me = await User.findById(myId);
  if (!me) throw new Error('유저 정보를 찾을 수 없습니다.');

  // 1. 맞팔친구: 나의 팔로잉 중 나를 팔로우하는 유저
  const myFollowing = me.following.map((id: mongoose.Types.ObjectId) => id.toString());
  const mutualFriends = await User.find({
    _id: { $in: myFollowing },
    following: myId
  });
  const mutualFriendIds = mutualFriends.map((f: IUser) => (f._id as mongoose.Types.ObjectId).toString());

  // 2. 맞팔친구들이 팔로잉하는 유저들
  let candidates: Set<string> = new Set();
  for (const friend of mutualFriends) {
    for (const fid of friend.following as mongoose.Types.ObjectId[]) {
      candidates.add(fid.toString());
    }
  }

  // 3. 본인, 이미 팔로우한 유저, 맞팔친구 제외
  candidates.delete(myId.toString());
  myFollowing.forEach((id: string) => candidates.delete(id));
  mutualFriendIds.forEach((id: string) => candidates.delete(id));

  // 4. DB에서 후보 유저 정보 조회
  const users = await User.find({ _id: { $in: Array.from(candidates) } })
    .select('nickname profileImage bio followers');
  // 5. 팔로워 많은 순 정렬 후 10명
  const sorted = users.sort((a: IUser, b: IUser) => b.followers.length - a.followers.length).slice(0, 10);
  return sorted;
}; 