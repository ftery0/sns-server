import { Router } from 'express';
import {
  createChat,
  getMyChats,
  getChatMessages,
  sendMessage
} from '../controllers/chatController';

const router = Router();

// 채팅방 생성
router.post('/', createChat);
// 내 채팅방 목록
router.get('/', getMyChats);
// 채팅방 메시지 조회
router.get('/:id/messages', getChatMessages);
// 메시지 전송
router.post('/:id/messages', sendMessage);

export default router; 