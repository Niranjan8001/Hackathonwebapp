import fetch from 'node-fetch';

async function testRegister() {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Test Farmer ' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            role: 'farmer'
        })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
}

testRegister();
