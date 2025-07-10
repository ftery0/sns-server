import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import User, { IUser } from '../models/User';
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ provider: 'google', providerId: profile.id });
        if (!user) {
          user = await User.create({
            email: profile.emails?.[0]?.value || '',
            nickname: profile.displayName || '구글유저',
            profileImage: profile.photos?.[0]?.value,
            provider: 'google',
            providerId: profile.id,
            followers: [],
            following: [],
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID || '',
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL || '',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ provider: 'instagram', providerId: profile.id });
        if (!user) {
          user = await User.create({
            email: profile.emails?.[0]?.value || '',
            nickname: profile.displayName || '인스타유저',
            profileImage: profile.photos?.[0]?.value,
            provider: 'instagram',
            providerId: profile.id,
            followers: [],
            following: [],
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport; 