const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not Set ✗');

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log('Host:', mongoose.connection.host);
        console.log('Database:', mongoose.connection.name);

        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testConnection();
