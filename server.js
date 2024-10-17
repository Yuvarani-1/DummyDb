const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');

dotenv.config(); 

const app = express();
app.use(express.json()); 
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Define Routes
app.use('/api/auth', authRoutes); 
app.use('/api/admin', protectedRoutes);  

// Test Route
app.get('/test', (req, res) => {
    res.send('Test route works!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
