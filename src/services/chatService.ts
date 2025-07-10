import Chat, { IChat, IMessage } from '../models/Chat';
import mongoose from 'mongoose';

export const createChatService = async (
  myId: mongoose.Types.ObjectId,
  members: mongoose.Types.ObjectId[],
  isGroup: boolean
): Promise<IChat> => {
  // 본인 추가
  if (!members.map(id => id.toString()).includes(myId.toString())) {
    members.push(myId);
  }
  return Chat.create({ members, isGroup, messages: [] });
};

export const getMyChatsService = async (myId: mongoose.Types.ObjectId): Promise<IChat[]> => {
  return Chat.find({ members: myId })
    .populate('members', 'nickname profileImage')
    .sort({ updatedAt: -1 });
};

export const getChatMessagesService = async (chatId: mongoose.Types.ObjectId): Promise<IMessage[]> => {
  const chat = await Chat.findById(chatId).populate('messages.sender', 'nickname profileImage');
  if (!chat) throw new Error('채팅방을 찾을 수 없습니다.');
  return chat.messages;
};

export const sendMessageService = async (
  chatId: mongoose.Types.ObjectId,
  senderId: mongoose.Types.ObjectId,
  text: string
): Promise<IMessage> => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('채팅방을 찾을 수 없습니다.');
  const message: IMessage = { sender: senderId, text, createdAt: new Date() };
  chat.messages.push(message);
  await chat.save();
  return message;
}; 