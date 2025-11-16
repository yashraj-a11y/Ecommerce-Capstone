
const express = require('express')
const Checkout = require('../models/Checkout')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Order = require('../models/order') 
const {protect} = require('../middleware/authMiddleware')
const router = require('./userRoutes')

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private

router.post('/' , protect , async(req,res) => {
    const {checkoutItems , shippingAddress , paymentMethod , totalPrice} = req.body

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({message : 'no items in checkout'})

    } 
    try {
        // Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,  
            checkoutItems : checkoutItems ,
            shippingAddress ,
            paymentMethod ,
            totalPrice ,
            paymentStatus : 'Pending' ,
            isPaid : false
        }) ;
        console.log(`checkout created for user ${req.user._id}`);
        res.status(201).json(newCheckout)
        
    } catch (err) {
        console.error('error in creating checkout session' ,err);
        res.status(500).json({message : 'Server Error'})

        
    }

})

// @route PUT/api/checkout/:id/pay
// @desc Update checkout to marks as paid after successful payment
// @access Private

router.put('/:id/pay' , protect , async(req,res) => {
    const {paymentStatus , paymentDetails } = req.body

    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            res.status(404).json({message : 'Checkout not Found'})

        }

        if (paymentStatus === 'paid') {
            checkout.isPaid = true ;
            checkout.paymentStatus = paymentStatus ;
            checkout.paymentDetails = paymentDetails ;
            checkout.paidAt = Date.now() ;
            await checkout.save()

            res.status(200).json(checkout)
        } else {
            res.status(400).json({message : 'Invalid Payment Status'})
        }

    } catch(err) {
        console.error(err);
        res.status(500).json({message : 'Server Error'}) 
    }
})

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private

router.post('/:id/finalize' ,protect , async(req,res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({message : 'Checkout Not Found'})
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            // create a final order based on the the checkout details
            const finalOrder = await Order.create({
                user : checkout.user ,
                orderItems : checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress ,
                paymentMethod : checkout.paymentMethod ,
                totalPrice : checkout.totalPrice ,
                isPaid : true ,
                paidAt : checkout.paidAt ,
                paymentStatus : 'paid' ,
                paymentDetails : checkout.paymentDetails

            }) ;
            // /Mark the checkout as finalized
            checkout.isFinalized = true ;
            checkout.finalizedAt = Date.now() ;
            await checkout.save()

            // Delete the cart associated with the user
            await Cart.findOneAndDelete({user : checkout.user});
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized) {
            res.status(200).json({message : 'checkout already finalzed'})

        } else {
            res.status(400).json({message : 'checkout is not paid'})

        }
    } catch(err) {
        console.error(err);
        res.status(500).json({message : 'Sever Error'})
        
    }
}) ;

module.exports = router ;


