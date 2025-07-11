import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as InstagramStrategy } from 'passport-instagram';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local Strategy (일반 로그인)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email, provider: 'local' });
        if (!user || !user.password) {
          return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Google Strategy (임시 비활성화)
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ provider: 'google', providerId: profile.id });
//         if (!user) {
//           user = await User.create({
//             email: profile.emails?.[0]?.value || '',
//             nickname: profile.displayName || '구글유저',
//             profileImage: profile.photos?.[0]?.value,
//             provider: 'google',
//             providerId: profile.id,
//             followers: [],
//             following: [],
//           });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.use(
//   new InstagramStrategy(
//     {
//       clientID: process.env.INSTAGRAM_CLIENT_ID || '',
//       clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
//       callbackURL: process.env.INSTAGRAM_CALLBACK_URL || '',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ provider: 'instagram', providerId: profile.id });
//         if (!user) {
//           user = await User.create({
//             email: profile.emails?.[0]?.value || '',
//             nickname: profile.displayName || '인스타유저',
//             profileImage: profile.photos?.[0]?.value,
//             provider: 'instagram',
//             providerId: profile.id,
//             followers: [],
//             following: [],
//           });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

export default passport; 