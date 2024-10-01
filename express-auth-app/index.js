require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {name: username};

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

