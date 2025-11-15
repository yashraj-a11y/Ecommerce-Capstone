const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get a cart by userId OR guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } 
    if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart
// @desc Add a product to cart (guest or logged user)
// @access Public
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'ProductId and quantity are required.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const index = cart.products.findIndex(
                (item) =>
                    item.productId.toString() === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (index > -1) {
                cart.products[index].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || null,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        }

        const newCart = await Cart.create({
            user: userId || undefined,
            guestId: guestId || 'guest_' + Date.now(),
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images?.[0]?.url || null,
                    price: product.price,
                    size,
                    color,
                    quantity,
                },
            ],
            totalPrice: product.price * quantity,
        });

        return res.status(201).json(newCart);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart (guest or logged user)
// @access Public
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);

        if (!cart) return res.status(404).json({ message: 'Cart not Found' });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product Not Found in the Cart' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'server Error' });
    }
});

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not Found in the Cart' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/cart
// @desc Get logged-in user’s or guest user’s cart
// @access Public
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not Found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: 'Guest cart is empty' });
            }

            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );

                await userCart.save();

                try {
                    await Cart.findOneAndDelete({ guestId });
                } catch (err) {
                    console.error('Error deleting guest cart:', err);
                }

                return res.status(200).json(userCart);
            } else {
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            } else {
                return res.status(404).json({ message: 'Guest Cart not found' });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
