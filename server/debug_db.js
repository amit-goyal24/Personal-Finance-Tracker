const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config/config.env' });

console.log('Attempting to connect to:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
        process.exit(0);
    } catch (err) {
        console.log(`Error: ${err.message}`.red);
        console.log('Cause:', err.cause);
        process.exit(1);
    }
}

connectDB();
