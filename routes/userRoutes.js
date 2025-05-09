import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

router.get('/get-user-data/:user_id', userController.getUserData);
router.post('/login', userController.login);

export default router;
