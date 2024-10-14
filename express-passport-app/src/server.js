import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieSession from 'cookie-session';
import config from 'config';

import {getDirName} from './utils/paths.js';
import {makeConnection} from './utils/mongoose.js';
import {User} from './models/users.model.js';
import './config/passport.js';
import {checkAuthenticated, checkNotAuthenticated} from './middlewares/auth.js';

dotenv.config();

const isMongooseConnected = await makeConnection();

const app = express();

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
}));
app.use(function (req, res, next) {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (callback) => callback()
    }
    if (req.session && !req.session.save) {
        req.session.save = (callback) => callback()
    }
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.set('view engine', 'ejs');
app.set('views', path.join(getDirName(import.meta.url), 'views'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index', {user: req.user});
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/')
        });
    })(req, res, next);
});

app.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
    } catch (error) {
        console.log(error);
        res.redirect('/signup');
    }
    res.redirect('/login');
});

app.post('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

if (isMongooseConnected) {
    const serverConfig = config.get('server');
    app.listen(serverConfig.port, () => {
        console.log(`Server is running on port ${serverConfig.port}`);
    });
} else {
    console.log('Server cannot start.');
}