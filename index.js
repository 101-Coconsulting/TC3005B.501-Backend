// Main entry point for the backend application

// Import required modules
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: "This is my backend endpoint for the travel management system" });
});

// Routes will be imported and used here
// Example: app.use('/api/users', require('./routes/users'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
