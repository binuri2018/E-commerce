const express = require('express'); // Import express
const dotenv = require('dotenv'); // Import dotenv for environment variables
const cors = require('cors'); // Import cors for cross-origin resource sharing

// Import the database connection function
const connectDB = require('./config/db');
// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config(); // Load environment variables from .env

connectDB(); // Connect to MongoDB

const app = express(); // Initialize the Express app

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: 'Server Error' });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});