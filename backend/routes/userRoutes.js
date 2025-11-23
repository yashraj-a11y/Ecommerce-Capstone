const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    console.log('credentials not being provided');
    return res.status(404).json({message : "invalid credentials"})
    
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user instance
    user = new User({ name, email, password });
    await user.save();
    console.log('user data saved succesfully');
    

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log('invalid credentials')
      return res.status(400).json({ message: "Invalid credentials" });
}
    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('invalid password')
      return res.status(400).json({ message: "Invalid credentials" });

    }
      

    // Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route DET/api/users/profile
// @desc Get loggged in user`s profile(Protected Route)
// @access Private 

router.get('/profile' , protect , async(req,res) => {
    res.json(req.user)
})

module.exports = router;
