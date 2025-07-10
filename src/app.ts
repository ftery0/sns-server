import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sessionMiddleware } from './config/session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import chatRoutes from './routes/chatRoutes';
import bestRoutes from './routes/bestRoutes';
import recommendRoutes from './routes/recommendRoutes';

// 라우터 임포트 (추후 구현)
// import userRoutes from './routes/userRoutes';
// import postRoutes from './routes/postRoutes';
// import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/best', bestRoutes);
app.use('/api/recommend', recommendRoutes);

// 라우터 연결 (추후 구현)
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send('SNS 서버가 정상적으로 동작 중입니다.');
});

export default app;
