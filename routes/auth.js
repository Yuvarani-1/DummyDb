const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router(); // Use router directly

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/login',
  [
    check('name', 'Please include a valid name').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    console.log('Login attempt');

    try {
      let user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role, 
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
          
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Public (removed authorization check)
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});
  
// @route   GET /api/users/me
// @desc    Get logged-in user's data
// @access  Public (removed authorization check)
router.get('/me', async (req, res) => { 
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});
  
// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Public (removed authorization check)
router.put('/:id', async (req, res) => {
    const { name, password, role } = req.body;
  
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (password) userFields.password = password; // You should hash this before saving
    if (role) userFields.role = role;
  
    try {
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});
  
// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Public (removed authorization check)
router.delete('/:id', async (req, res) => {
    try {
      await User.findByIdAndRemove(req.params.id);
      res.json({ msg: 'User removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});
module.exports = router; 
