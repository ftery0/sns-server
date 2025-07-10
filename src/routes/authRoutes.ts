import { Router, Request, Response } from 'express';
import passport from '../config/passport';

const router = Router();

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 콜백
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  (req: Request, res: Response) => {
    res.redirect('/auth/success');
  }
);

// 인스타그램 로그인
router.get('/instagram', passport.authenticate('instagram'));

// 인스타그램 콜백
router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/auth/fail' }),
  (req: Request, res: Response) => {
    res.redirect('/auth/success');
  }
);

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