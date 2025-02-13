const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ CORS Configuration - Allow All Origins
app.use(cors()); // This should be enough, but we add explicit headers below

// ✅ Explicitly Set CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ✅ Handle Preflight (OPTIONS) Requests
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

// Middleware for JSON requests
app.use(express.json());

// ✅ Test Route
app.get('/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Routes
app.use('/', require('./routes/index.js'));

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port: ${PORT}`);
});

