const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let userId = '';
let testProductId = '';
let guestId = 'test_guest_' + Date.now();

// ANSI color codes for better output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.yellow}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Test User Authentication APIs
async function testUserAuth() {
    log.section('Testing User Authentication APIs');

    try {
        // Test 1: Register new user
        log.info('Test 1: POST /api/users/register');
        const registerRes = await axios.post(`${BASE_URL}/users/register`, {
            name: 'API Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'testpass123'
        });

        if (registerRes.data.token && registerRes.data.user) {
            authToken = registerRes.data.token;
            userId = registerRes.data.user._id;
            log.success('User registration successful');
            log.info(`  Token: ${authToken.substring(0, 20)}...`);
            log.info(`  User ID: ${userId}`);
        } else {
            log.error('Registration response missing token or user data');
        }

        // Test 2: Login
        log.info('\nTest 2: POST /api/users/login');
        const loginRes = await axios.post(`${BASE_URL}/users/login`, {
            email: registerRes.data.user.email,
            password: 'testpass123'
        });

        if (loginRes.data.token) {
            log.success('User login successful');
        } else {
            log.error('Login failed');
        }

        // Test 3: Get user profile
        log.info('\nTest 3: GET /api/users/profile (Protected)');
        const profileRes = await axios.get(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (profileRes.data.email) {
            log.success('Profile fetch successful');
            log.info(`  Name: ${profileRes.data.name}`);
            log.info(`  Email: ${profileRes.data.email}`);
        } else {
            log.error('Profile fetch failed');
        }

    } catch (error) {
        log.error(`User Auth Test Failed: ${error.response?.data?.message || error.message}`);
    }
}

// Test Product APIs
async function testProducts() {
    log.section('Testing Product APIs');

    try {
        // Test 1: Get all products
        log.info('Test 1: GET /api/products');
        const productsRes = await axios.get(`${BASE_URL}/products`);

        if (Array.isArray(productsRes.data) && productsRes.data.length > 0) {
            log.success(`Products fetched: ${productsRes.data.length} products`);
            testProductId = productsRes.data[0]._id;
            log.info(`  First product: ${productsRes.data[0].name}`);
        } else {
            log.error('No products found');
        }

        // Test 2: Get product by ID
        if (testProductId) {
            log.info('\nTest 2: GET /api/products/:id');
            const productRes = await axios.get(`${BASE_URL}/products/${testProductId}`);

            if (productRes.data._id === testProductId) {
                log.success('Product detail fetch successful');
                log.info(`  Product: ${productRes.data.name}`);
                log.info(`  Price: $${productRes.data.price}`);
            } else {
                log.error('Product detail fetch failed');
            }
        }

        // Test 3: Get new arrivals
        log.info('\nTest 3: GET /api/products/new-arrivals');
        const newArrivalsRes = await axios.get(`${BASE_URL}/products/new-arrivals`);

        if (Array.isArray(newArrivalsRes.data)) {
            log.success(`New arrivals fetched: ${newArrivalsRes.data.length} products`);
        } else {
            log.error('New arrivals fetch failed');
        }

        // Test 4: Get best seller
        log.info('\nTest 4: GET /api/products/best-seller');
        try {
            const bestSellerRes = await axios.get(`${BASE_URL}/products/best-seller`);
            if (bestSellerRes.data) {
                log.success(`Best seller fetched: ${bestSellerRes.data.name}`);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                log.info('  No best seller found (expected if no ratings)');
            } else {
                throw err;
            }
        }

        // Test 5: Search products
        log.info('\nTest 5: GET /api/products?search=shirt');
        const searchRes = await axios.get(`${BASE_URL}/products?search=shirt`);

        if (Array.isArray(searchRes.data)) {
            log.success(`Search results: ${searchRes.data.length} products`);
        } else {
            log.error('Search failed');
        }

        // Test 6: Filter by collection
        log.info('\nTest 6: GET /api/products?collection=men');
        const filterRes = await axios.get(`${BASE_URL}/products?collection=men`);

        if (Array.isArray(filterRes.data)) {
            log.success(`Collection filter results: ${filterRes.data.length} products`);
        } else {
            log.error('Collection filter failed');
        }

    } catch (error) {
        log.error(`Product Test Failed: ${error.response?.data?.message || error.message}`);
    }
}

// Test Cart APIs
async function testCart() {
    log.section('Testing Cart APIs');

    try {
        // Test 1: Add to cart (guest user)
        log.info('Test 1: POST /api/cart (Guest)');
        const addToCartRes = await axios.post(`${BASE_URL}/cart`, {
            productId: testProductId,
            quantity: 2,
            size: 'M',
            color: 'Blue',
            guestId: guestId
        });

        if (addToCartRes.data.products && addToCartRes.data.products.length > 0) {
            log.success('Product added to guest cart');
            log.info(`  Cart total: $${addToCartRes.data.totalPrice}`);
            log.info(`  Items in cart: ${addToCartRes.data.products.length}`);
        } else {
            log.error('Add to cart failed');
        }

        // Test 2: Get cart (guest)
        log.info('\nTest 2: GET /api/cart?guestId=...');
        const getCartRes = await axios.get(`${BASE_URL}/cart?guestId=${guestId}`);

        if (getCartRes.data.products) {
            log.success('Guest cart fetched successfully');
            log.info(`  Items: ${getCartRes.data.products.length}`);
        } else {
            log.error('Get cart failed');
        }

        // Test 3: Update cart quantity
        log.info('\nTest 3: PUT /api/cart (Update quantity)');
        const updateCartRes = await axios.put(`${BASE_URL}/cart`, {
            productId: testProductId,
            quantity: 3,
            size: 'M',
            color: 'Blue',
            guestId: guestId
        });

        if (updateCartRes.data.products) {
            log.success('Cart quantity updated');
            log.info(`  New total: $${updateCartRes.data.totalPrice}`);
        } else {
            log.error('Update cart failed');
        }

        // Test 4: Merge guest cart with user cart
        if (authToken) {
            log.info('\nTest 4: POST /api/cart/merge (Protected)');
            const mergeRes = await axios.post(
                `${BASE_URL}/cart/merge`,
                { guestId: guestId },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (mergeRes.data.products) {
                log.success('Guest cart merged with user cart');
                log.info(`  Total items: ${mergeRes.data.products.length}`);
            } else {
                log.error('Cart merge failed');
            }
        }

        // Test 5: Get user cart
        if (userId) {
            log.info('\nTest 5: GET /api/cart?userId=...');
            const userCartRes = await axios.get(`${BASE_URL}/cart?userId=${userId}`);

            if (userCartRes.data.products) {
                log.success('User cart fetched successfully');
                log.info(`  Items: ${userCartRes.data.products.length}`);
            } else {
                log.error('Get user cart failed');
            }
        }

        // Test 6: Remove from cart
        log.info('\nTest 6: DELETE /api/cart');
        const deleteRes = await axios.delete(`${BASE_URL}/cart`, {
            data: {
                productId: testProductId,
                size: 'M',
                color: 'Blue',
                userId: userId
            }
        });

        if (deleteRes.data) {
            log.success('Product removed from cart');
        } else {
            log.error('Remove from cart failed');
        }

    } catch (error) {
        log.error(`Cart Test Failed: ${error.response?.data?.message || error.message}`);
    }
}

// Test Checkout and Order APIs
async function testCheckoutAndOrders() {
    log.section('Testing Checkout & Order APIs');

    try {
        // First add a product to cart for testing
        await axios.post(`${BASE_URL}/cart`, {
            productId: testProductId,
            quantity: 1,
            size: 'L',
            color: 'Black',
            userId: userId
        });

        // Test 1: Create order
        log.info('Test 1: POST /api/checkout (Protected)');
        const orderRes = await axios.post(
            `${BASE_URL}/checkout`,
            {
                shippingAddress: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'TS',
                    postalCode: '12345',
                    country: 'Test Country'
                },
                paymentMethod: 'Credit Card'
            },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (orderRes.data._id) {
            log.success('Order created successfully');
            log.info(`  Order ID: ${orderRes.data._id}`);
            log.info(`  Total: $${orderRes.data.totalPrice}`);
            orderId = orderRes.data._id;
        } else {
            log.error('Order creation failed');
        }

        // Test 2: Get user orders
        log.info('\nTest 2: GET /api/orders (Protected)');
        const ordersRes = await axios.get(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (Array.isArray(ordersRes.data)) {
            log.success(`User orders fetched: ${ordersRes.data.length} orders`);
            if (ordersRes.data.length > 0) {
                log.info(`  Latest order: ${ordersRes.data[0]._id}`);
            }
        } else {
            log.error('Get orders failed');
        }

    } catch (error) {
        log.error(`Checkout/Order Test Failed: ${error.response?.data?.message || error.message}`);
    }
}

// Main test runner
async function runAllTests() {
    console.log('\n');
    log.section('🚀 Starting Comprehensive API Tests');

    try {
        await testUserAuth();
        await testProducts();
        await testCart();
        await testCheckoutAndOrders();

        log.section('✅ All API Tests Completed');
    } catch (error) {
        log.error('Test suite failed with error: ' + error.message);
    }
}

// Run tests
runAllTests();
