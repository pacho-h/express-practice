import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import {getDirName} from './utils/paths.js';
import {makeConnection} from './utils/mongoose.js';

dotenv.config();

const isMongooseConnected = await makeConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.join(getDirName(import.meta.url), 'views'));

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});

if (isMongooseConnected) {
    const port = 4000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} else {
    console.log('Server cannot start.');
}