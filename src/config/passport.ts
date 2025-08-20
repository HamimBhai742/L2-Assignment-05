import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user/user.model';
import bcryptjs from 'bcrypt';
passport.use(
  new LocalStrategy(
    {
      usernameField: 'phone',
      passwordField: 'password',
    },
    async (phone: string, password: string, done) => {
      try {
        const isExsit = await User.findOne({ phone });
        if (!isExsit) {
          return done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcryptjs.compare(password, isExsit.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, isExsit);
      } catch (error) {
        return done(error);
      }
    }
  )
);
