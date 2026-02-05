const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
        global.dbConnected = true;
    } catch (err) {
        console.log(`Error: ${err.message}`.red);
        console.log('Using in-memory fallback mode (Data will not be persisted)'.yellow.bold);
        global.dbConnected = false;
        // process.exit(1);
    }
}

// Default to true if not failing, but actual success sets it to true? 
// No, line 5 awaits. If it passes, we are good.
// We should explicit set true on success to be safe, although we can assume true if we didn't catch?
// Better to set it.

module.exports = connectDB;
