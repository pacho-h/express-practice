import dotenv from 'dotenv';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import {User} from '../models/users.model.js';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
            done(null, user);
        }
    );
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email: email.toLocaleLowerCase()});
        if (!user) {
            return done(null, false, {message: `Email ${email} not found.`});
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, {message: 'Invalid email or password.'});
        });

    } catch (error) {
        return done(error);
    }
}));

passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({googleId: profile.id});
            if (user) {
                return done(null, user);
            } else {
                const user = new User();
                user.email = profile.emails[0].value;
                user.googleId = profile.id;
                try {
                    await user.save();
                    done(null,user);
                } catch (err) {
                    done(err);
                }
            }
        } catch (err) {
            done(err);
        }
    }));
