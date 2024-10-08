import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});