import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const data = {
    posts: [
        {
            username: 'user1',
            title: 'Post 1'
        },
        {
            username: 'user2',
            title: 'Post 2'
        }
    ],
    refreshTokens: [],
}

const app = express();

app.use(express.json());
app.use(cookieParser())

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {name: username};

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
    data.refreshTokens.push(refreshToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        // secure: true, // using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({accessToken: accessToken});
});

app.get('/refresh', (req, res) =>{
    const cookies = req.cookies;
    if(!cookies?.refreshToken) return res.sendStatus(401);

    if(!data.refreshTokens.includes(cookies.refreshToken)) return res.sendStatus(403);

    jwt.verify(cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
        res.json({accessToken: accessToken});
    })
});

app.get('/posts', authMiddleware, (req, res) => {
    res.json(data.posts.filter(post => post.username === req.user.name));
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

