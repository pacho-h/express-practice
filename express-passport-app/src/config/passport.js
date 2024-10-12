import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {User} from '../models/users.model.js';

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