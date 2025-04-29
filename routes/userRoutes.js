import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

router.get('/users/:user_id', userController.getUserData);


export default router;