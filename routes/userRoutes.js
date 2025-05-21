import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

router.get('/get-user-data/:user_id', userController.getUserData);

router.router('/login')
    .post(userController.login);

router.route('/get-travel-request/:request_id')
    .get(userController.getTravelRequestById);

router.route('/get-travel-requests/:dept/:status/:n?')
    .get(userController.getTravelRequestsByDeptStatus);

export default router;
