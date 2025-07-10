import app from './app';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 소켓 기본 연결
io.on('connection', (socket) => {
  console.log('새로운 클라이언트 접속:', socket.id);
  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id);
  });
});

// 몽고DB 연결 및 서버 시작
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB 연결 성공');
    httpServer.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });
