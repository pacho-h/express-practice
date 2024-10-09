import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import {getDirName} from './utils/paths.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.join(getDirName(import.meta.url), 'views'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.log('mongodb error', err)
    });

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});