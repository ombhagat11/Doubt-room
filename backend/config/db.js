const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Only exit if not in serverless environment
        if (require.main === module) {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

