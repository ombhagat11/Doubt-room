const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

async function checkRooms() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        console.log('Fetching all rooms...');
        const rooms = await Room.find({});

        console.log(`Found ${rooms.length} room(s):\n`);

        if (rooms.length === 0) {
            console.log('❌ No rooms in database!');
            console.log('\nCreating a test room...');

            const testRoom = await Room.create({
                title: 'DSA Doubt Room',
                topic: 'DSA',
                description: 'Ask your data structures and algorithms questions here',
                isPublic: true,
                createdBy: new mongoose.Types.ObjectId(), // Dummy user ID
                isActive: true
            });

            console.log('✅ Test room created!');
            console.log('Room ID:', testRoom._id);
            console.log('Title:', testRoom.title);
            console.log('Topic:', testRoom.topic);
        } else {
            rooms.forEach((room, index) => {
                console.log(`${index + 1}. ${room.title}`);
                console.log(`   Topic: ${room.topic}`);
                console.log(`   ID: ${room._id}`);
                console.log(`   Active: ${room.isActive}`);
                console.log(`   Public: ${room.isPublic}`);
                console.log('');
            });
        }

        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkRooms();
