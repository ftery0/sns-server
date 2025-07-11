import { Router, Request, Response } from 'express';
import passport from '../config/passport';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { IUser } from '../models/User';

const router = Router();

// 회원가입
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, userId, password, name } = req.body;
    
    // 필수 필드 검증
    if (!email || !userId || !password || !name) {
      return res.status(400).json({ message: '이메일, 아이디, 비밀번호, 이름을 모두 입력해주세요.' });
    }
    
    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }
    
    // 아이디 중복 확인
    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const user = await User.create({
      email,
      userId,
      password: hashedPassword,
      name,
      provider: 'local',
      followers: [],
      following: []
    });
    
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '회원가입 실패', error: err });
  }
});

// 일반 로그인 (아이디/비밀번호)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    
    // 필수 필드 검증
    if (!userId || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }
    
    // 사용자 찾기 (아이디로)
    const user = await User.findOne({ userId, provider: 'local' });
    if (!user || !user.password) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 로그인 성공 - 세션에 사용자 정보 저장
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: '로그인 처리 중 오류가 발생했습니다.' });
      }
      res.json({ 
        success: true, 
        message: '로그인 성공',
        user: { id: user._id, userId: user.userId, email: user.email, name: user.name }
      });
    });
  } catch (err) {
    res.status(500).json({ message: '로그인 실패', error: err });
  }
});

// 구글 로그인 (임시 비활성화)
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 콜백 (임시 비활성화)
// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/auth/fail' }),
//   (req: Request, res: Response) => {
//     res.redirect('/auth/success');
//   }
// );

// 인스타그램 로그인 (임시 비활성화)
// router.get('/instagram', passport.authenticate('instagram'));

// 인스타그램 콜백 (임시 비활성화)
// router.get('/instagram/callback',
//   passport.authenticate('instagram', { failureRedirect: '/auth/fail' }),
//   (req: Request, res: Response) => {
//     res.redirect('/auth/success');
//   }
// );

// 로그인 성공/실패
router.get('/success', (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});
router.get('/fail', (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: '로그인 실패' });
});

// 로그아웃
router.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ success: true, message: '로그아웃 완료' });
  });
});

// 로그인 상태 확인
router.get('/me', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router; 