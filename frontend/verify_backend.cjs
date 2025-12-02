const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function verifyBackend() {
    try {
        // 1. Register
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}`);

        try {
            await axios.post(`${BASE_URL}/users/register`, {
                name: 'Test User',
                email,
                password,
                role: 'customer'
            });
        } catch (e) {
            console.log('Registration error (might exist):', e.response?.data || e.message);
        }

        // 2. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/users/login`, {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token received.');

        // 3. Create Checkout
        console.log('Creating checkout...');
        const checkoutRes = await axios.post(`${BASE_URL}/checkout`, {
            checkoutItems: [
                {
                    name: 'Test Product',
                    quantity: 1,
                    price: 100,
                    productId: '64f8f8f8f8f8f8f8f8f8f8f8', // Mock ID
                    image: 'http://example.com/image.jpg',
                    color: 'Red',
                    size: 'M'
                }
            ],
            shippingAddress: {
                firstName: 'Test',
                lastName: 'User',
                address: '123 Main St',
                city: 'Test City',
                postalCode: '12345',
                country: 'Test Country',
                phone: '1234567890'
            },
            paymentMethod: 'PayPal',
            totalPrice: 100
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const checkoutId = checkoutRes.data._id;
        console.log(`Checkout created. ID: ${checkoutId}`);

        // 4. Pay (Mock)
        console.log('Simulating payment...');
        await axios.put(`${BASE_URL}/checkout/${checkoutId}/pay`, {
            paymentStatus: 'paid',
            paymentDetails: { id: 'mock_payment_id' }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Payment successful.');

        // 5. Finalize
        console.log('Finalizing order...');
        const finalizeRes = await axios.post(`${BASE_URL}/checkout/${checkoutId}/finalize`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Order finalized. Order ID:', finalizeRes.data._id);

        console.log('VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

verifyBackend();
