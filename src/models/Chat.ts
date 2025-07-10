import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[];
  messages: IMessage[];
  isGroup: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema: Schema = new Schema<IChat>({
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [MessageSchema],
  isGroup: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>('Chat', ChatSchema); 