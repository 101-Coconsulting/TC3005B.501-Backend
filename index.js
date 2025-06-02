// Main entry point for the backend application
import dotenv from "dotenv";
dotenv.config();

import applicantRoutes from './routes/applicantRoutes.js';
import authorizerRoutes from './routes/authorizerRoutes.js'
import userRoutes from './routes/userRoutes.js';
import travelAgentRoutes from "./routes/travelAgentRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import accountsPayableRoutes from './routes/accountsPayableRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

// Import MongoDB connection for file storage
import { connectMongo } from './services/fileStorage.js';

// Import required modules
import fs from "fs";
import https from "https";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: 'https://localhost:4321',
  credentials: true,
  methods: ['GET', 'POST', 'PUT']
}));

// Middleware for parsing JSON
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(cookieParser());

app.use("/api/applicant", applicantRoutes);
app.use("/api/authorizer", authorizerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel-agent", travelAgentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/accounts-payable", accountsPayableRoutes);
app.use("/api/files", fileRoutes);

// Connect to MongoDB for file storage
connectMongo().catch(err => console.error('Failed to connect to MongoDB:', err));

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
console.clear();
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () =>
  console.log(`
         )         )            (   (
   (  ( /(   (  ( /(      (     )\\ ))\\ )
   )\\ )\\())  )\\ )\\())     )\\   (()/(()/(
 (((_|(_)\ (((_|(_)\   ((((_)(  /(_))(_))
 )\\___ ((_))\\___ ((_)   )\\ _ )\\(_))(_))
((/ __/ _ ((/ __/ _ \\   (_)_\\(_) _ \\_ _|
 | (_| (_) | (_| (_) |   / _ \\ |  _/| |
  \\___\\___/ \\___\\___/   /_/ \\_\\|_| |___|
🚀 Server running on port ${PORT} with HTTPS
`),
);