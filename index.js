// Main entry point for the backend application
import dotenv from 'dotenv';
dotenv.config();

import applicantRoutes from './routes/applicantRoutes.js';

// Import required modules
import fs from 'fs';
import https from 'https';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

app.use("/api/applicants", applicantRoutes);

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

 
