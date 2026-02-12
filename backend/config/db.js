const mongoose = require('mongoose');

/**
 * Serverless-optimized MongoDB connection.
 * Uses a cached connection across warm Lambda/Vercel invocations
 * to avoid creating new connections on every request.
 */

// Cache the connection promise globally so it persists across
// warm serverless invocations (Node.js module cache is per-container)
let cached = global._mongooseConnection;

if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    // If we already have a ready connection, return immediately
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If a connection attempt is already in progress, await it
    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            return cached.conn;
        } catch (err) {
            // Previous attempt failed, reset and try again
            cached.promise = null;
        }
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set. Check your .env file.');
    }

    // Detect SRV vs standard connection string
    const isSRV = MONGODB_URI.startsWith('mongodb+srv://');

    const connectionOptions = {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        bufferCommands: true,
        maxPoolSize: 5,
    };

    // If using SRV and it keeps failing, suggest using standard format
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions);

    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;

        // Provide actionable error messages
        if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
            console.error(`❌ MongoDB connection error: ${error.message}`);
            console.error('');
            console.error('💡 Troubleshooting tips:');
            console.error('   1. Check if your MongoDB Atlas cluster is ACTIVE (not paused)');
            console.error('   2. Whitelist your IP in Atlas: Network Access → Add IP → 0.0.0.0/0');
            console.error('   3. Verify your MONGODB_URI in .env is correct');
            if (isSRV) {
                console.error('   4. Try using a standard connection string (mongodb://) instead of SRV (mongodb+srv://)');
                console.error('      You can find it in Atlas: Connect → Drivers → Connection String');
            }
            console.error('');
        } else if (error.message.includes('Authentication failed') || error.message.includes('auth')) {
            console.error(`❌ MongoDB auth error: Check username/password in MONGODB_URI`);
        } else {
            console.error(`❌ MongoDB connection error: ${error.message}`);
        }

        throw error;
    }
};

module.exports = connectDB;
