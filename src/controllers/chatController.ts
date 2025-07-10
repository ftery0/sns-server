import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createChatService, getMyChatsService, getChatMessagesService, sendMessageService } from '../services/chatService';

// 채팅방 생성 (1:1 또는 그룹)
export const createChat = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const myId = req.user._id as mongoose.Types.ObjectId;
    const { members, isGroup } = req.body as { members: string[]; isGroup: boolean };
    const memberIds = members.map(id => new mongoose.Types.ObjectId(id));
    const chat = await createChatService(myId, memberIds, isGroup);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: '채팅방 생성 실패', error: err });
  }
};

// 내 채팅방 목록
export const getMyChats = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const myId = req.user._id as mongoose.Types.ObjectId;
    const chats = await getMyChatsService(myId);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: '채팅방 조회 실패', error: err });
  }
};

// 채팅방 메시지 조회
export const getChatMessages = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.id);
    const messages = await getChatMessagesService(chatId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: '메시지 조회 실패', error: err });
  }
};

// 메시지 전송
export const sendMessage = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.id);
    const senderId = req.user._id as mongoose.Types.ObjectId;
    const { text } = req.body as { text: string };
    const message = await sendMessageService(chatId, senderId, text);
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: '메시지 전송 실패', error: err });
  }
}; 