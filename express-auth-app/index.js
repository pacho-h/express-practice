import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';

const posts = [
    {
        username: 'user1',
        title: 'Post 1'
    },
    {
        username: 'user2',
        title: 'Post 2'
    }
];

const app = express();

app.use(express.json());

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {name: username};

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});
});

app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
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

