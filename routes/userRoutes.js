import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

// Get user data by ID
router.get('/get-user-data/:user_id', userController.getUserData);

// Create a new user - Admin only endpoint
router.post('/create-user', userController.isAdmin, userController.createUser);

export default router;
