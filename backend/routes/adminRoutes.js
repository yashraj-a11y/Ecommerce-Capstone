

const express = require('express')
const User = require('../models/User')
const {protect , admin} = require('../middleware/authMiddleware')

const router = express.Router()

// @route Get /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin

router.get('/' , protect , admin , async(req , res) => {
    try {
        const users = await User.find({}) ;
        res.json(users) ; 



    } catch(err) {
        console.error(err);
        res.status(500).json({message : 'server error'})
    
    }
})

// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/admin

router.post('/' , protect , admin , async(req,res) => {
    const {name , email , password , role} = req.body

    try {
        let user = await User.findOne({email})
        if (user) {
            return res.status(400).json({message : 'User already exists'})
        }

        user = new User({
            name, 
            email ,
            password , 
            role : role || 'customer' ,

        }) ;
        await user.save()
        res.status(201).json({message : 'User created successfully'})


    } catch (err)  {
        console.error(err);
        res.status(500).json('server error')

    }
})

// @route PUT/api/admin/users/:id
// @desc Update user info (admin only) - Name , email and role
// @access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      message: "User updated successfully",
      ...updatedUser.toObject()
    });

  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE api/admin/users/:id
// @desc Delete a user
// @access Private/Admin

router.delete('/:id' , protect , admin , async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            await user.deleteOne() ;
            res.json({message : 'User deleted successfully'})
        } else {
            res.status(404).json({message : 'User not found'})
        }

    } catch (err) {
        console.error(err);
        res.status(500).json('server error')
    
    }

    
})


module.exports = router ;