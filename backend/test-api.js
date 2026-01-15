// Test API endpoints
const axios = require('axios');

async function testAPI() {
    const baseURL = 'http://localhost:5000/api';

    console.log('Testing DoubtRoom API...\n');

    // Test 1: Health check
    try {
        const health = await axios.get('http://localhost:5000');
        console.log('✅ Server is running');
        console.log('Response:', health.data);
    } catch (error) {
        console.log('❌ Server not responding');
        return;
    }

    console.log('\n---\n');

    // Test 2: Register a test user
    console.log('Creating test user...');
    try {
        const registerRes = await axios.post(`${baseURL}/auth/register`, {
            name: 'Test User',
            email: `test${Date.now()}@test.com`,
            password: 'password123',
            role: 'mentor'
        });

        const token = registerRes.data.token;
        console.log('✅ User created successfully');
        console.log('Token:', token.substring(0, 20) + '...');

        console.log('\n---\n');

        // Test 3: Get rooms with auth
        console.log('Fetching rooms with authentication...');
        try {
            const roomsRes = await axios.get(`${baseURL}/rooms`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Rooms fetched successfully');
            console.log('Found', roomsRes.data.count, 'room(s)');
            console.log('Rooms:', roomsRes.data.data.map(r => r.title));
        } catch (error) {
            console.log('❌ Failed to fetch rooms');
            console.log('Error:', error.response?.data || error.message);
        }

    } catch (error) {
        console.log('❌ Failed to create user');
        console.log('Error:', error.response?.data || error.message);
    }
}

testAPI();
