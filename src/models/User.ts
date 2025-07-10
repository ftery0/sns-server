import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  provider: 'google' | 'instagram' | 'local';
  providerId: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  profileImage: { type: String },
  bio: { type: String },
  provider: { type: String, enum: ['google', 'instagram', 'local'], required: true },
  providerId: { type: String, required: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema); 