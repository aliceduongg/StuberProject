// creating backend API
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Make sure you import mongoose
const { error } = require('console');


// to access .env file
require('dotenv').config();

// Middleware 
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json()); //  to parse JSON data 

// Connect to mongoose database
mongoose.connect(process.env.MONGO_URI)
.then (() => console.log('Connected to MongoDB'))
.catch ((error) => console.error ('Could not connect to MongoDB', error));

app.get("/api/home", (req, res) => {
    res.json({ message: 'Hello from server!' });
}
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/user', require('./routes/profile'));


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})