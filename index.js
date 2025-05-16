// Main entry point for the backend application
import dotenv from "dotenv";
dotenv.config();

import applicantRoutes from './routes/applicantRoutes.js';
import authorizerRoutes from './routes/authorizerRoutes.js'
import userRoutes from './routes/userRoutes.js';
import travelAgentRoutes from "./routes/travelAgentRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import accountsPayableRoutes from './routes/accountsPayableRoutes.js';

// Import required modules
import fs from "fs";
import https from "https";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

app.use("/api/applicants", applicantRoutes);
app.use("/api/authorizer", authorizerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel-agent", travelAgentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/accounts-payable", accountsPayableRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({
        message: "This is my backend endpoint for the travel management system",
    });
});


// Certificates credentials for usage of HTTPS
const privateKey = fs.readFileSync("./certs/server.key", "utf8");
const certificate = fs.readFileSync("./certs/server.crt", "utf8");
const ca = fs.readFileSync("./certs/ca.crt", "utf8");
const credentials = { key: privateKey, cert: certificate, ca: ca };

// HTTPS server configuration
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT} with HTTPS`),
);
