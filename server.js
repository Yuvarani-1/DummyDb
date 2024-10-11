const express = require('express');
const mongoose= require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');

require('dotenv').config()
mongoose.connect('mongodb://localhost:27017/dummyDB',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api', protectedRoutes);  

app.get('/test', (req, res) => {
    res.send('Test route works!');
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
