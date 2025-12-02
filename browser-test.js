// Comprehensive E-commerce Browser Test with Playwright
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = './test-screenshots';

// Test results tracking
const testResults = {
    passed: [],
    failed: [],
    screenshots: []
};

async function setupScreenshotDir() {
    try {
        await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
    } catch (err) {
        console.error('Error creating screenshot directory:', err);
    }
}

async function takeScreenshot(page, name) {
    const filename = `${name}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    testResults.screenshots.push(filepath);
    console.log(`📸 Screenshot saved: ${filename}`);
    return filepath;
}

function logSuccess(message) {
    console.log(`✅ ${message}`);
    testResults.passed.push(message);
}

function logError(message) {
    console.log(`❌ ${message}`);
    testResults.failed.push(message);
}

function logSection(title) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 ${title}`);
    console.log('='.repeat(60));
}

async function testHomePage(page) {
    logSection('TEST 1: Home Page');

    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Take screenshot
        await takeScreenshot(page, '01-home-page');

        // Check for key elements
        const hasNavigation = await page.locator('nav').count() > 0;
        if (hasNavigation) logSuccess('Navigation menu found');

        // Check for products section
        const hasProducts = await page.locator('img').count() > 0;
        if (hasProducts) logSuccess('Home page loaded with content');

        logSuccess('Home Page Test Complete');
    } catch (error) {
        logError(`Home Page Test Failed: ${error.message}`);
    }
}

async function testProductListing(page) {
    logSection('TEST 2: Product Listing/Collection Page');

    try {
        // Try to navigate to a collection
        await page.goto(`${BASE_URL}/collection/men`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await takeScreenshot(page, '02-collection-page');

        // Check for product grid
        const productCount = await page.locator('img').count();
        if (productCount > 0) {
            logSuccess(`Collection page loaded with ${productCount} product images`);
        }

        logSuccess('Product Listing Test Complete');
    } catch (error) {
        // Try alternative route
        try {
            await page.goto(BASE_URL, { waitUntil: 'networkidle' });
            await page.waitForTimeout(1000);

            // Look for any product links
            const productLinks = await page.locator('a[href*="product"]').count();
            if (productLinks > 0) {
                logSuccess('Products found on page');
            }
        } catch (err) {
            logError(`Product Listing Test Failed: ${error.message}`);
        }
    }
}

async function testProductDetail(page) {
    logSection('TEST 3: Product Detail Page');

    try {
        // First, get a product ID from the products API
        const response = await page.request.get('http://localhost:5001/api/products');
        const products = await response.json();

        if (products && products.length > 0) {
            const productId = products[0]._id;
            await page.goto(`${BASE_URL}/product/${productId}`, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            await takeScreenshot(page, '03-product-detail');

            // Check for product elements
            const hasImage = await page.locator('img').count() > 0;
            if (hasImage) logSuccess('Product detail page loaded with images');

            // Look for add to cart button
            const addToCartBtn = await page.getByText('Add to Cart', { exact: false }).count();
            if (addToCartBtn > 0) logSuccess('Add to Cart button found');

            logSuccess('Product Detail Test Complete');
        }
    } catch (error) {
        logError(`Product Detail Test Failed: ${error.message}`);
    }
}

async function testRegistration(page) {
    logSection('TEST 4: User Registration');

    try {
        await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        await takeScreenshot(page, '04-register-page');

        // Fill registration form
        const timestamp = Date.now();
        const testEmail = `browsertest${timestamp}@example.com`;

        // Try to find and fill form fields
        try {
            await page.fill('input[type="text"], input[name="name"]', 'Browser Test User');
            await page.fill('input[type="email"], input[name="email"]', testEmail);
            await page.fill('input[type="password"], input[name="password"]', 'test123456');

            await takeScreenshot(page, '05-register-filled');

            // Click submit/register button
            await page.click('button[type="submit"]');
            await page.waitForTimeout(2000);

            await takeScreenshot(page, '06-after-register');

            logSuccess(`Registration form submitted with email: ${testEmail}`);
            logSuccess('Registration Test Complete');
        } catch (err) {
            logError(`Could not fill registration form: ${err.message}`);
        }
    } catch (error) {
        logError(`Registration Test Failed: ${error.message}`);
    }
}

async function testLogin(page) {
    logSection('TEST 5: User Login');

    try {
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        await takeScreenshot(page, '07-login-page');

        // Try login with test credentials
        try {
            await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
            await page.fill('input[type="password"], input[name="password"]', 'password123');

            await takeScreenshot(page, '08-login-filled');

            await page.click('button[type="submit"]');
            await page.waitForTimeout(2000);

            await takeScreenshot(page, '09-after-login');

            logSuccess('Login Test Complete');
        } catch (err) {
            logError(`Could not complete login: ${err.message}`);
        }
    } catch (error) {
        logError(`Login Test Failed: ${error.message}`);
    }
}

async function testCart(page) {
    logSection('TEST 6: Shopping Cart');

    try {
        await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await takeScreenshot(page, '10-cart-page');

        logSuccess('Cart Page Test Complete');
    } catch (error) {
        logError(`Cart Test Failed: ${error.message}`);
    }
}

async function testProfile(page) {
    logSection('TEST 7: Profile Page');

    try {
        await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await takeScreenshot(page, '11-profile-page');

        logSuccess('Profile Page Test Complete');
    } catch (error) {
        logError(`Profile Test Failed: ${error.message}`);
    }
}

async function testOrders(page) {
    logSection('TEST 8: Orders Page');

    try {
        await page.goto(`${BASE_URL}/orders`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await takeScreenshot(page, '12-orders-page');

        logSuccess('Orders Page Test Complete');
    } catch (error) {
        logError(`Orders Test Failed: ${error.message}`);
    }
}

async function printSummary() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    console.log(`📸 Screenshots: ${testResults.screenshots.length}`);

    if (testResults.failed.length > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.failed.forEach(f => console.log(`   - ${f}`));
    }

    console.log(`\n📁 Screenshots saved in: ${SCREENSHOT_DIR}/`);
    console.log('='.repeat(60) + '\n');
}

async function runTests() {
    console.log('\n🚀 Starting Browser Tests with Playwright\n');

    await setupScreenshotDir();

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
        await testHomePage(page);
        await testProductListing(page);
        await testProductDetail(page);
        await testRegistration(page);
        await testLogin(page);
        await testCart(page);
        await testProfile(page);
        await testOrders(page);

        await printSummary();
    } catch (error) {
        console.error('❌ Test suite error:', error);
    } finally {
        await browser.close();
    }
}

runTests().catch(console.error);
