
const express = require('express')
const Order = require('../models/order')
const {protect , admin} = require('../middleware/authMiddleware')

const router = express.Router()

// @route GET /api/admin/orders
// @desc Get all order (Admin only)
// @access Private/admin

router.get('/' , protect, admin , async(req , res) => {
    try {
        const orders = await Order.find({}).populate('user' , "name email")
        res.json(orders)

    } catch(err)  {
        console.error(err);
        return res.status(500).json({message : 'server Error'})
        
    }
})

//  @route PUT /api/admin/orders/:id
// @desc Update orders status
// @access Private/Admin

router.put('/:id' , protect, admin , async(req,res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            order.status = req.body.status || order.status ;
            order.isDelivered = 
                req.body.status === 'Delivered' ? true : order.isDelivered ;
                order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt

           const updatedOrder = await order.save()
           res.json(updatedOrder)     
 
        } else {
            res.status(404).json({message : 'Order not found'})

        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'server error'})
  
    }
})

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin

router.delete('/:id' , protect,admin , async(req,res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (order) {
            await order.deleteOne() ;
            res.json({message : 'Order removed'})

        } else {
            res.status(404).json({message : 'Order not found'})

        }
    } catch(err) {
        console.error(err);
        return res.status(500).json('server error')
        
    }
})





module.exports = router ;