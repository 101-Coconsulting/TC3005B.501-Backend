// Main entry point for the backend application

// Import required modules
const express = require('express');
const fs = require('fs')
const https = require('https')
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

// Certificates credentials for usage of HTTPS
const privateKey = fs.readFileSync('./certs/server.key', 'utf8');
const certificate = fs.readFileSync('./certs/server.crt', 'utf8');
const ca = fs.readFileSync('./certs/ca.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

// HTTPS server configuration
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Server running on port ${PORT} with HTTPS`));

 
