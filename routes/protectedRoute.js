const express = require('express');
const User = require('../models/User');
const router = express.Router();

<<<<<<< HEAD
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ msg: 'Access denied' });
};

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
=======
router.get('/admin',(req, res) => {
  res.json({ msg: 'Welcome, Admin!' });
>>>>>>> c5a43e384b59905803bde11e39790e8ae5e3d4d4
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (Admin only)
// @access  Private
router.put('/users/:id', isAdmin, async (req, res) => {
  const { name, password, role } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (password) userFields.password = password; // Password should be hashed in pre-save hook
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

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
