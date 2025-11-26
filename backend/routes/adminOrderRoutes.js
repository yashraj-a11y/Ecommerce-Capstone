
const express = require('express')
const Order = require('../models/order')
const {protect , admin} = require('../middleware/authMiddleware')

const router = express.Router()

// @route GET /api/admin/orders
// @desc Get all order (Admin only)
// @access Private/admin

router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email');

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


//  @route PUT /api/admin/orders/:id
// @desc Update orders status
// @access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update Order
        order.status = status;
        order.isDelivered = status === 'Delivered';
        order.deliveredAt = status === 'Delivered' ? Date.now() : order.deliveredAt;

        await order.save();

        // Re-populate user so UI does not break
        const updatedOrder = await Order.findById(order._id)
            .populate('user', 'name email');

        res.json(updatedOrder);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ message: 'Order removed' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router ;