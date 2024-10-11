const express = require('express');
const router = express.Router();


router.get('/admin',(req, res) => {
  res.json({ msg: 'Welcome, Admin!' });
});

router.get('/admin', (req, res) => {
  res.json({ msg: 'Welcome, Admin!' }); 
});

module.exports = router;
