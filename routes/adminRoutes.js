import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/adminController.js';

// Route for creating a single user
router.post('/create-user', adminController.createUser);

export default router;