const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password during registration: ${hashedPassword}`);
    
    // Create new user
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  console.log('Received login request with:', req.body);

  try {
    // Find user in the database
    let user = await User.findOne({ name });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log('User fetched from database:', user);

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isMatch}`);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If passwords match, generate a JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log('JWT generated successfully');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Debug function to manually test bcrypt hash comparison
router.post('/debug-hash', async (req, res) => {
  const { plainPassword } = req.body;
  const hashedPasswordFromDB = '$2a$10$6pgYf3jngESm4Wjt99dBN.rkxaOF3f9eqU6HS4ezuEbsFQPY8e1uC';

  try {
    // Manually hash the plain password to see if it matches the DB hash
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(`Manually hashed password: ${hashedPassword}`);

    // Compare with the stored hash
    const isMatch = await bcrypt.compare(plainPassword, hashedPasswordFromDB);
    console.log(`Manual password comparison result: ${isMatch}`);

    res.json({ isMatch });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch logged-in user
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, password, role } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (password) userFields.password = await bcrypt.hash(password, 10); // Hash password before saving
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

// Delete user
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
