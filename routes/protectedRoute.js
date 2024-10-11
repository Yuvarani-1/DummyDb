const express = require('express');
const router = express.Router();

// Example protected route for admin users
router.get('/admin',(req, res) => {
  res.json({ msg: 'Welcome, Admin!' });
});

router.get('/admin', (req, res) => {
  res.json({ msg: 'Welcome, Admin!' }); 
});


module.exports = router;
