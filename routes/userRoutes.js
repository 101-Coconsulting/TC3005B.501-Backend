// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Apply token authentication middleware to this route
router.get('/get-user-data/:user_id', authenticateToken, userController.getUserData);

module.exports = router;