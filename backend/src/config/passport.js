import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔐 Google OAuth callback:', profile.id);

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log('✅ Existing Google user found');
          return done(null, user);
        }

        // Check if email is already registered locally
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.profilePicture = profile.photos?.[0]?.value || user.profilePicture;
          user.authProvider = 'google';
          await user.save();
          console.log('✅ Linked Google to existing user');
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          profilePicture: profile.photos?.[0]?.value || '',
          authProvider: 'google',
          isVerified: false,
          verificationStatus: 'pending'
        });

        console.log('✅ New Google user created');
        done(null, user);
      } catch (error) {
        console.error('❌ Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;