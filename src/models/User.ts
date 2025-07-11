import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  userId: string;
  name: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  provider: 'google' | 'instagram' | 'local';
  providerId?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  provider: { type: String, enum: ['google', 'instagram', 'local'], required: true },
  providerId: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema); 