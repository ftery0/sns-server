import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  image?: string;
  content: string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>('Post', PostSchema); 