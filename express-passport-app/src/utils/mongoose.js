import mongoose from 'mongoose';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
export const makeConnection = () => {
    return mongoose.connect(process.env.MONGODB_URI, clientOptions)
        .then(() => {
            console.log('mongodb connected')
            return true;
        })
        .catch((err) => {
            console.log('mongodb error', err)
            return false;
        });
};
